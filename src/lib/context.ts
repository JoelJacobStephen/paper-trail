import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = pinecone.index("paper-trail");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    console.log("Embeddings length:", embeddings.length);
    console.log("File key:", fileKey);
    console.log("Namespace:", convertToAscii(fileKey));

    const queryResult = await namespace.query({
      topK: 10,
      vector: embeddings,
      includeMetadata: true,
    });

    console.log("Query Result full:", JSON.stringify(queryResult, null, 2));

    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  console.log("File Key: ", fileKey);

  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  const docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  console.log("Matches: ", matches);
  console.log("Docs: ", docs);

  return docs.join("\n").substring(0, 3000);
}
