import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    console.log("calling openai");

    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });

    const result = await response.json();

    if (result.error) {
      console.log("openai error", result.error);
      throw new Error(result.error.message);
    }

    if (Array.isArray(result.data) && result.data.length > 0) {
      const embedding = result.data[0].embedding as number[];
      if (embedding.length !== 1536) {
        throw new Error(
          `Vector dimension ${embedding.length} does not match the dimension of the index 1536`
        );
      }
      return embedding;
    } else {
      console.log("openai result data is not valid", result.data);
      return [];
    }
  } catch (error) {
    console.log("error calling openai", error);
    throw error;
  }
}
