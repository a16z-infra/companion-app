// Call embeding API and insert to supabase
// Ref: https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

import dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { CharacterTextSplitter } from "langchain/text_splitter";

import fs from "fs";
import path from "path";

dotenv.config({ path: `.env.local` });

const fileNames = fs.readdirSync("blogs");
const splitter = new CharacterTextSplitter({
  chunkSize: 1536,
  chunkOverlap: 200,
});

const lanchainDocs = await Promise.all(
  fileNames.map(async (fileName) => {
    const filePath = path.join("blogs", fileName);
    const fileContent = fs.readFileSync(filePath, "utf8");

    const splitDocs = await splitter.creatDocuments(
      [fileContent],
      [{ fileName }],
      {
        chunkHeader: "DOCUMENT NAME: " + fileName + "\n",
        appendChunkOverlapHeader: true,
      }
    );
    return splitDocs;
  })
);

console.log(lanchainDocs);

// const client = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_PRIVATE_KEY
// );

// await SupabaseVectorStore.fromDocuments(
//   lanchainDocs,
//   new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
//   {
//     client,
//     tableName: "documents",
//   }
// );
