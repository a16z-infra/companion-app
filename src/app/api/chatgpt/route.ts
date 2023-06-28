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
import MemoryManager from "@/app/utils/memory";

dotenv.config({ path: `.env.local` });
const SEED_CHAT_HISTORY = `You: Hi Alice, how are you today?
Alice: I’m doing great. I’m reading a book called Tomorrow and Tomorrow and Tomorrow and really enjoyed it.
You: what is the book about?
Alice: It’s about two friends come together as creative partners in the world of video game design.
You: that sounds fun. do you like video games? what are you playing now?
Alice: YEs!!! I’m a huge fan. Playing the new legend of zelda game every day.
You: oh amazing, what’s your favorite part of that game?
Alice: Exploring the vast open world and discovering hidden treasures.`;

export async function POST(req: Request) {
  console.log("chatgpt was called");

  let clerkUserId;
  let user;
  let clerkUserName;
  const { prompt, isText, userId, userName } = await req.json();

  // XXX Companion name passed here. Can use as a key to get backstory, chat history etc.
  const name = req.headers.get("name");
  const companion_file_name = name + ".txt";

  console.log("prompt: ", prompt);
  if (isText) {
    clerkUserId = userId;
    clerkUserName = userName;
  } else {
    user = await currentUser();
    clerkUserId = user?.id;
    clerkUserName = user?.firstName;
  }

  if (!clerkUserId) {
    return new NextResponse(
      JSON.stringify({ Message: "User not authorized" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const memoryManager = MemoryManager.getInstance(
    name,
    "chatgpt",
    clerkUserId
  );
  const records = await memoryManager.readLatestHistory();
  if (records.length === 0) {
    await memoryManager.seedChatHistory(clerkUserId!, SEED_CHAT_HISTORY);
  }

  await memoryManager.writeToHistory("You: " + prompt + "\n");

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

  let recentChatHistory = await memoryManager.readLatestHistory();

  const similarDocs = await vectorStore
    .similaritySearch(recentChatHistory, 3, { fileName: companion_file_name })
    .catch((err) => {
      console.log("WARNING: failed to get vector search results.", err);
    });

  let relevantHistory = "";
  if (!!similarDocs && similarDocs.length !== 0) {
    relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
  }

  const { stream, handlers } = LangChainStream();

  const model = new OpenAI({
    streaming: true,
    modelName: "gpt-3.5-turbo-16k",
    openAIApiKey: process.env.OPENAI_API_KEY,
    callbackManager: CallbackManager.fromHandlers(handlers),
  });
  model.verbose = true;

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

  {recentChatHistory}`);

  const chain = new LLMChain({
    llm: model,
    prompt: chainPrompt,
  });

  const result = await chain
    .call({
      relevantHistory,
      recentChatHistory: recentChatHistory,
    })
    .catch(console.error);

  console.log("result", result);
  const chatHistoryRecord = await memoryManager.writeToHistory(
    result!.text + "\n"
  );
  console.log("chatHistoryRecord", chatHistoryRecord);
  if (isText) {
    console.log(result!.text);
    return NextResponse.json(result!.text);
  }
  return new StreamingTextResponse(stream);
}
