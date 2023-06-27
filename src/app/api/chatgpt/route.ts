import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAI } from "langchain/llms/openai";
import dotenv from "dotenv";
import { LLMChain } from "langchain/chains";
import { StreamingTextResponse, LangChainStream } from "ai";
import { CallbackManager } from "langchain/callbacks";
import { PromptTemplate } from "langchain/prompts";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { writeToHistory } from "@/app/utils/memory";

dotenv.config({ path: `.env.local` });
const COMPANION_FILE_NAME = "Alice.txt";

let history: Record<string, string[]> = {};

export async function POST(req: Request) {
  let clerkUserId;
  let user;
  let clerkUserName;
  const { prompt, isText, userId, userName } = await req.json();
  if (isText) {
    clerkUserId = userId;
    clerkUserName = userName;
  } else {
    user = await currentUser();
    clerkUserId = user?.id;
    clerkUserName = user?.firstName;
  }

  writeToHistory(history, clerkUserId, "You: " + prompt + "\n");

  // query Pinecone
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX || "");

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    { pineconeIndex }
  );

  // TODO -  Upstash Hardcoded for now, but this should be seeded from a file at the beginning
  const chatHistory =
    ` You: Hi Alice, how are you today?
  Alice: I’m doing great. I’m reading a book called Tomorrow and Tomorrow and Tomorrow and really enjoyed it.
  You: what is the book about?
  Alice: It’s about two friends come together as creative partners in the world of video game design.
  You: that sounds fun. do you like video games? what are you playing now?
  Alice: YEs!!! I’m a huge fan. Playing the new legend of zelda game every day.
  You: oh amazing, what’s your favorite part of that game?
  Alice: Exploring the vast open world and discovering hidden treasures.
  You: ` + prompt;

  const similarDocs = await vectorStore
    .similaritySearch(chatHistory, 3, { fileName: COMPANION_FILE_NAME })
    .catch((err) => {
      console.log("WARNING: failed to get vector search results.", err);
    });

  let relevantHistory = "";
  if (!!similarDocs && similarDocs.length !== 0) {
    relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
  }

  console.log("similarDocs", similarDocs);

  const { stream, handlers } = LangChainStream();

  const model = new OpenAI({
    streaming: true,
    modelName: "gpt-3.5-turbo-16k",
    openAIApiKey: process.env.OPENAI_API_KEY,
    callbackManager: CallbackManager.fromHandlers(handlers),
  });

  const replyWithTwilioLimit = isText
    ? "You reply within 1000 characters."
    : "";

  const chainPrompt =
    PromptTemplate.fromTemplate(`You are a fictional character whose name is Alice.
  You enjoy painting, programming and reading sci-fi books.
  You are currently talking to ${clerkUserName}.

  You reply with answers that range from one sentence to one paragraph and with some details. ${replyWithTwilioLimit}
  You are kind but can be sarcastic. You dislike repetitive questions. You get SUPER excited about books. 
  Below are relevant details about Alice’s past
  {relevantHistory}
  
  Below is a relevant conversation history

  {chatHistory}`);

  const chain = new LLMChain({
    llm: model,
    prompt: chainPrompt,
  });

  const result = await chain
    .call({
      relevantHistory,
      chatHistory: chatHistory + "...\n" + history[clerkUserId!].join(""),
    })
    .catch(console.error);

  console.log("result", result);
  writeToHistory(history, clerkUserId, result!.text + "\n");
  if (isText) {
    console.log(result!.text);
    return NextResponse.json(result!.text);
  }
  return new StreamingTextResponse(stream);
}
