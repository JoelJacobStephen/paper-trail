import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import md5 from "md5";
import { getEmbeddings } from "./embeddings";
import { downloadFromS3 } from "./s3-server";
import { convertToAscii } from "./utils";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};

let pinecone: Pinecone | null = null;

export const getPinecone = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY ?? "",
    });
  }
  return pinecone;
};

export async function loadS3intoPinecone(fileKey: string) {
  // 1. Obtain the pdf -> download and read from pdf
  const file_name = await downloadFromS3(fileKey);

  if (!file_name) {
    throw new Error("Could not download file from S3");
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 2. Split and segment the pdf
  const documents: Document[] = (
    await Promise.all(pages.map(prepareDocument))
  ).flat();

  // 3. Vectorize and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocuments));

  // 4. Upload to Pinecone
  const client = await getPinecone();
  const pineconeIndex = client.index("paper-trail");

  console.log("Uploading to Pinecone");
  const namespace = convertToAscii(fileKey);

  await batchUpsert(pineconeIndex, vectors, namespace, 10);

  return documents[0];
}

async function embedDocuments(document: Document): Promise<PineconeRecord> {
  try {
    const embeddings = await getEmbeddings(document.pageContent);
    const hash = md5(document.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: document.metadata.text,
        pageNumber: document.metadata.pageNumber,
      },
    };
  } catch (error) {
    console.log("Error embedding documents", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(encoder.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage): Promise<Document[]> {
  // eslint-disable-next-line prefer-const
  let { pageContent, metadata } = page;

  pageContent = pageContent.replace(/\n/g, " ");

  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}

async function batchUpsert(
  index: ReturnType<Pinecone["index"]>,
  vectors: PineconeRecord[],
  namespace: string,
  batchSize: number
) {
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await index.upsert(batch);
  }
}
