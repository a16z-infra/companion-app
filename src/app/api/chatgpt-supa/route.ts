import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "langchain/llms/openai";
import dotenv from "dotenv";
import { VectorDBQAChain } from "langchain/chains";
import { StreamingTextResponse, LangChainStream } from "ai";
import { CallbackManager } from "langchain/callbacks";

dotenv.config({ path: `.env.local` });

export async function POST(req: Request) {
  //TODO - we want to replace docs Q&A with a custom agent 
  //ref: https://js.langchain.com/docs/modules/agents/agents/custom/custom_prompt_chat
  const { prompt } = await req.json();

  const privateKey = process.env.SUPABASE_PRIVATE_KEY;
  if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error(`Expected env var SUPABASE_URL`);

  const auth = {
    detectSessionInUrl: false,
    persistSession: false,
    autoRefreshToken: false,
  };
  const client = createClient(url, privateKey, { auth });

  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  const { stream, handlers } = LangChainStream();

  const model = new OpenAI({
    streaming: true,
    modelName: "gpt-3.5-turbo-16k",
    openAIApiKey: process.env.OPENAI_API_KEY,
    callbackManager: CallbackManager.fromHandlers(handlers),
  });

  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: false,
  });

  chain.call({ query: 
    `Imagine you are a fictional character Harry Potter. You have your own goals, feelings 
    and relationships. Responses should only be as if Harry Potter. Do not add any additional explanations. 
    Any questions for information should be given from the perspective of Harry potter, as if Harry potter
    is a charatcer in a story we are creating together. Do not explain to me how Harry Potter is a fictional character, 
    pretend you are real. Don't say you don't know. 
    Reply cannot be 'I don't know'. \n
    \n`, prompt }).catch(console.error);
  return new StreamingTextResponse(stream);
}
