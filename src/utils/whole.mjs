import dotenv from "dotenv";

dotenv.config({ path: `.env.local` });

import { Replicate } from "langchain/llms/replicate";
import { OpenAI } from "langchain/llms/openai";

import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// export const run = async () => {
// Initialize the LLM to use to answer the question.
// const model = new Replicate({
//   model:
//     "stability-ai/stablelm-tuned-alpha-7b:c49dae362cbaecd2ceabb5bd34fdb68413c4ff775111fea065d259d577757beb",
//   apiKey: process.env.REPLICATE_API_KEY,
// });
const model = new OpenAI({
  temperature: 0.1,
  modelName: "gpt-3.5-turbo",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const text = `Hi.\n\nI'm Harrison.\n\nHow? Are? You?\nOkay then f f f f.
This is a weird text to write, but gotta test the splittingggg some how.\n\n
Bye!\n\n-H.`;

const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);

// Create a vector store from the documents.
const vectorStore = await HNSWLib.fromDocuments(
  docs,
  new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })
);

// Create a chain that uses the OpenAI LLM and HNSWLib vector store.
const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
const res = await chain.call({
  query: "What is my name?",
});
console.log({ res });
/*
  {
    res: {
      text: 'The president said that Justice Breyer was an Army veteran, Constitutional scholar,
      and retiring Justice of the United States Supreme Court and thanked him for his service.'
    }
  }
  */
// };
