import { readFileSync, writeFileSync } from "fs";
import OpenAI from "openai";
import { join } from "path";

export type DataWithEmbeddings = {
  input: string;
  embeddings: number[];
};

const openai = new OpenAI({
  organization: "org-sk-proj-N6rEHBxMN0db3LTjHT3BlbkFJIKRu88SxQup7hCykvvuH",
});

export const generateEmbeddings = async (input: string | string[]) => {
  const response = await openai.embeddings.create({
    input: input,
    model: "text-embedding-3-small",
  });
  console.log(response.data);
  return response;
};

export const loadInputJson = <T>(fileName: string): T => {
  const path = join(__dirname, fileName);
  const rawInputData = readFileSync(path);
  return JSON.parse(rawInputData.toString());
};

const saveEmbeddingsToJson = (embeddings: any, fileName: string) => {
  const embeddingsString = JSON.stringify(embeddings);
  const buffer = Buffer.from(embeddingsString);
  const path = join(__dirname, fileName);
  writeFileSync(path, buffer);
  console.log(`Embeddings saved to ${path}`);
};

const main = async () => {
  const input = loadInputJson<string[]>("inputstatements.json");
  const embeddings = await generateEmbeddings(input);
  const dataWithEmbeddings: DataWithEmbeddings[] = input.map(
    (input, index) => ({
      input,
      embeddings: embeddings.data[index].embedding,
    })
  );
  saveEmbeddingsToJson(dataWithEmbeddings, "dataWithEmbeddings2.json");
};

// Uncomment the line below to run the main function
// main();

// Example for chat completions
const openaiChat = new OpenAI();

async function mainChat() {
  const stream = await openaiChat.chat.completions.create({
    model: "gpt-35-turbo",
    messages: [{ role: "user", content: "Say this is a test" }],
    stream: true,
  });
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

// Uncomment the line below to run the mainChat function
// mainChat();