// Call embeding API and insert to supabase
// Ref: https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
//      https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase
import dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

import fs from "fs";
import path from "path";

dotenv.config({ path: `.env.local` });

const fileNames = fs.readdirSync("blogs");
const lanchainDocs = fileNames.map((fileName) => {
  const filePath = path.join("blogs", fileName);
  const fileContent = fs.readFileSync(filePath, "utf8");
  return new Document({
    metadata: { fileName },
    pageContent: fileContent,
  });
});

const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PRIVATE_KEY);

await SupabaseVectorStore.fromDocuments(
  lanchainDocs,
  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  {
    client,
    tableName: "documents",
  }
);
