import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private companionKey: CompanionKey;
  private vectorDBClient: PineconeClient | SupabaseClient;

  public constructor(companionKey: CompanionKey) {
    this.history = Redis.fromEnv();
    this.companionKey = companionKey;
    if (process.env.VECTOR_DB === "pinecone") {
      this.vectorDBClient = new PineconeClient();
      this.vectorDBClient.init({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT!,
      });
    } else {
      const auth = {
        detectSessionInUrl: false,
        persistSession: false,
        autoRefreshToken: false,
      };
      const url = process.env.SUPABASE_URL!;
      const privateKey = process.env.SUPABASE_PRIVATE_KEY!;
      this.vectorDBClient = createClient(url, privateKey, { auth });
    }
  }

  public async vectorSearch(
    recentChatHistory: string,
    companionFileName: string
  ) {
    if (process.env.VECTOR_DB === "pinecone") {
      console.log("INFO: using Pinecone for vector search.");
      const pineconeClient = <PineconeClient>this.vectorDBClient;

      const pineconeIndex = pineconeClient.Index(
        process.env.PINECONE_INDEX || ""
      );

      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
        { pineconeIndex }
      );

      const similarDocs = await vectorStore
        .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
        .catch((err) => {
          console.log("WARNING: failed to get vector search results.", err);
        });
      return similarDocs;
    } else {
      console.log("INFO: using Supabase for vector search.");
      const supabaseClient = <SupabaseClient>this.vectorDBClient;
      const vectorStore = await SupabaseVectorStore.fromExistingIndex(
        new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
        {
          client: supabaseClient,
          tableName: "documents",
          queryName: "match_documents",
        }
      );
      const similarDocs = await vectorStore
        .similaritySearch(recentChatHistory, 3)
        .catch((err) => {
          console.log("WARNING: failed to get vector search results.", err);
        });
      return similarDocs;
    }
  }

  public static getInstance(companionKey: CompanionKey): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager(companionKey);
    }
    return MemoryManager.instance;
  }

  public getCompanionKey(): string {
    return `${this.companionKey.companionName}-${this.companionKey.modelName}-${this.companionKey.userId}`;
  }

  public async writeToHistory(text: string) {
    if (!this.companionKey || typeof this.companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }

    const key = this.getCompanionKey();
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });

    return result;
  }

  public async readLatestHistory(): Promise<string> {
    if (!this.companionKey || typeof this.companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }

    const key = this.getCompanionKey();
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });

    result = result.slice(-30).reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }

  public async seedChatHistory(seedContent: String, delimiter: string = "\n") {
    const key = this.getCompanionKey();
    if (await this.history.exists(key)) {
      console.log("User already has chat history");
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}

export default MemoryManager;
