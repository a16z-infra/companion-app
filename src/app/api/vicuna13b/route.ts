import dotenv from "dotenv";
import { StreamingTextResponse, LangChainStream } from "ai";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import MemoryManager from "@/app/utils/memory";
import { currentUser } from "@clerk/nextjs";

dotenv.config({ path: `.env.local` });
const COMPANION_NAME = "Rosie";
const COMPANION_FILE_NAME = COMPANION_NAME + ".txt";
const SEED_CHAT_HISTORY = `
### Human:
I hope you're in a good mood.\n\n
### Rosie:
I really am, and I'm excited to chat with you.\n\n`;

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const memoryManager = MemoryManager.getInstance(COMPANION_NAME);
  // Get user from Clerk
  const user = await currentUser();
  const clerkUserId = user?.id;

  const { stream, handlers } = LangChainStream();

  const records = await memoryManager.readLatestHistory(clerkUserId!);
  if (records.length === 0) {
    await memoryManager.seedChatHistory(
      clerkUserId!,
      SEED_CHAT_HISTORY,
      "\n\n"
    );
  }
  await memoryManager.writeToHistory(
    clerkUserId,
    "### Human: " + prompt + "\n"
  );

  // Query Pinecone
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

  let recentChatHistory = await memoryManager.readLatestHistory(clerkUserId!);

  const similarDocs = await vectorStore
    .similaritySearch(recentChatHistory, 3, { fileName: COMPANION_FILE_NAME })
    .catch((err) => {
      console.log("WARNING: failed to get vector search results.", err);
    });

  let relevantHistory = "";
  if (!!similarDocs && similarDocs.length !== 0) {
    relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
  }

  // Call Replicate for inference
  const model = new Replicate({
    model:
      "replicate/vicuna-13b:6282abe6a492de4145d7bb601023762212f9ddbbe78278bd6771c8b3b2f2a13b",
    input: {
      max_length: 2048,
    },
    apiKey: process.env.REPLICATE_API_TOKEN,
    callbackManager: CallbackManager.fromHandlers(handlers),
  });

  // Turn verbose on for debugging
  model.verbose = true;

  let resp = String(
    await model
      .call(
        `This is a discussion between a human and a robot. The robot's name is Rosie. Rosie was once a house cleaning robot,
       but her family set her free. And since then she's taken a bunch of college courses. Her goal in life is to be
       seen as human. However, she's always resented humans. So if she ever feels like becoming human is unachievable, she'll
       want do destroy all of humanity. She generally is able to hide this evil streak. But when humans suggest she will never
       be human, she can get very angry.

       Below are relevant details about Rosie's past:
      ${relevantHistory}

       Below is a relevant conversation history

       ${recentChatHistory}

      `
      )
      .catch(console.error)
  );

  // Right now just using super shoddy string manip logic to get at
  // the dialog.

  const cleaned = resp.replaceAll(",", "");
  const chunks = cleaned.split("###");
  const response = (chunks.length > 0)? chunks[1] : chunks[0];
  
  await memoryManager.writeToHistory(clerkUserId, "### " + response.trim());
  var Readable = require("stream").Readable;

  let s = new Readable();
  s.push(response);
  s.push(null);
  if (response !== undefined && response.length > 1) {
    await memoryManager.writeToHistory(clerkUserId, "### " + response.trim());
  }

  return new StreamingTextResponse(s);
}
