"use server";

// server action to allow configuration of LLM from .env.local
import dotenv from "dotenv";
import { parse } from "path";
import { headers } from "next/headers";

export async function getCompanions() {
  const headerOptions = headers();
  const baseUrl = headerOptions.get("x-forwarded-proto") + "://" + headerOptions.get("host");
  return fetch(baseUrl + "/api/companions")
    .then((response) => response.json());
}