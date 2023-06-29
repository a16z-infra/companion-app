import dotenv from "dotenv";
import { StreamingTextResponse, LangChainStream } from "ai";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import MemoryManager from "@/app/utils/memory";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

dotenv.config({ path: `.env.local` });
const SEED_CHAT_HISTORY = `
### Human:
I hope you're in a good mood.\n\n
### Rosie:
I really am, and I'm excited to chat with you.\n\n`;

export async function POST(request: Request) {
  const { prompt } = await request.json();

  // XXX Companion name passed here. Can use as a key to get backstory, chat history etc.
  const name = request.headers.get("name");
  const companion_file_name = name + ".txt";

  // Get user from Clerk
  const user = await currentUser();
  const clerkUserId = user?.id;

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

  // Load character "PREAMBLE" from character file. These are the core personality
  // characteristics that are used in every prompt. Additional background is
  // only included if it matches a similarity comparioson with the current
  // discussion. The PREAMBLE should include a seed conversation whose format will 
  // vary by the model using it. 
  const fs = require('fs').promises;
  const data = await fs.readFile("companions/"+companion_file_name, "utf8")

  // Clunky way to break out PREAMBLE and SEEDCHAT from the character file
  const presplit = data.split("###ENDPREAMBLE###");
  const preamble = presplit[0]; 
  const seedsplit = presplit[1].split('###ENDSEEDCHAT###');
  const seedchat = seedsplit[0];

  // console.log("Preamble: "+preamble);
  // console.log("Seedchat: "+seedchat);

  const memoryManager = MemoryManager.getInstance(
    name!,
    "vicuna13b",
    clerkUserId
  );

  const { stream, handlers } = LangChainStream();

  const records = await memoryManager.readLatestHistory();
  if (records.length === 0) {
    await memoryManager.seedChatHistory(seedchat, "\n\n");
  }
  await memoryManager.writeToHistory("### Human: " + prompt + "\n");

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

  let recentChatHistory = "";
  recentChatHistory = await memoryManager.readLatestHistory();

  // Right now the preamble is included in the similarity search, but that
  // shouldn't be an issue

  const similarDocs = await vectorStore
    .similaritySearch(recentChatHistory, 3, { fileName: companion_file_name })
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
       `${preamble}  
       
       Below are relevant details about ${name}'s past:
       ${relevantHistory}

       Below is a relevant conversation history

       ${recentChatHistory}`
      )
      .catch(console.error)
  );

  // Right now just using super shoddy string manip logic to get at
  // the dialog.

  const cleaned = resp.replaceAll(",", "");
  const chunks = cleaned.split("###");
  const response = chunks.length > 1 ? chunks[1] : chunks[0];

  await memoryManager.writeToHistory("### " + response.trim());
  var Readable = require("stream").Readable;

  let s = new Readable();
  s.push(response);
  s.push(null);
  if (response !== undefined && response.length > 1) {
    await memoryManager.writeToHistory("### " + response.trim());
  }

  return new StreamingTextResponse(s);
}
