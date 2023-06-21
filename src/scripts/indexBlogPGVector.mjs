// Call embeding API and insert to supabase
// Ref: https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

import dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import fs from "fs";
import path from "path";

dotenv.config({ path: `.env.local` });

const fileNames = fs.readdirSync("blogs");
const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
  chunkSize: 1000,
  chunkOverlap: 50,
});

const langchainDocs = await Promise.all(
  fileNames.map(async (fileName) => {
    const filePath = path.join("blogs", fileName);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const splitDocs = await splitter.splitText(fileContent);
    return splitDocs.map((doc) => {
      return new Document({
        metadata: { fileName },
        pageContent: doc,
      });
    });
  })
);

const auth = {
  detectSessionInUrl: false,
  persistSession: false,
  autoRefreshToken: false,
};

const client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY,
  { auth }
);

await SupabaseVectorStore.fromDocuments(
  langchainDocs.flat(),
  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  {
    client,
    tableName: "documents",
  }
);
