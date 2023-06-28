import { Redis } from "@upstash/redis";
import { get } from "http";

class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private companionName: string;
  private modelName: string;
  private userId: string;

  private constructor(
    companionName: string,
    userId: string,
    modelName: string
  ) {
    this.history = Redis.fromEnv();
    this.userId = userId;
    this.companionName = companionName;
    this.modelName = modelName;
  }

  public static getInstance(
    companionName: string,
    modelName: string,
    userId: string
  ): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager(
        companionName,
        modelName,
        userId
      );
    }
    return MemoryManager.instance;
  }

  private getCompanionKey() {
    return this.userId + "-" + this.companionName + "-" + this.modelName;
  }

  public async writeToHistory(text: string) {
    if (typeof this.userId == "undefined") {
      console.log("No user id");
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
    if (typeof this.userId == "undefined") {
      console.log("No user id");
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
