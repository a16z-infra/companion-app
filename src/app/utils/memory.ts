import { Redis } from "@upstash/redis";

class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  public companionName: string;

  private constructor(companionName: string) {
    this.history = Redis.fromEnv();
    this.companionName = companionName;
  }

  public static getInstance(companionName: string): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager(companionName);
    }
    return MemoryManager.instance;
  }

  public async writeToHistory(userId: string | undefined, text: string) {
    if (typeof userId == "undefined") {
      console.log("No user id");
      return "";
    }

    const key = userId + "-" + this.companionName;
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });

    return result;
  }

  public async readLatestHistory(userId: string | undefined): Promise<string> {
    if (typeof userId == "undefined") {
      console.log("No user id");
      return "";
    }

    const key = userId + "-" + this.companionName;
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });

    result = result.slice(-30).reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }

  public async seedChatHistory(
    userId: string,
    seedContent: String,
    delimiter: string = "\n"
  ) {
    const key = userId + "-" + this.companionName;
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
