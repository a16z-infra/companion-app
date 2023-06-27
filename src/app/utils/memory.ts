import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { Redis } from "@upstash/redis";

export async function handleChat(prompt: string) {}

export function writeToHistory(
  history: Record<string, string[]>,
  userId: string | undefined,
  text: string
): string {
  if (typeof userId == "undefined") {
    console.log("No user id");
    return "";
  }

  if (history[userId] == undefined) {
    history[userId] = [];
  }
  const userHistory = history[userId] || [];
  if (userHistory.length == 30) {
    userHistory.shift();
  }
  userHistory.push(text + "\n");
  console.log(userHistory);
  return history[userId].join("\n");
}
