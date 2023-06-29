import { Redis } from "@upstash/redis";
import { get } from "http";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private companionKey: CompanionKey;

  public constructor(companionKey: CompanionKey) {
    this.history = Redis.fromEnv();
    this.companionKey = companionKey;
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
