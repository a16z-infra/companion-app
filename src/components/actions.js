'use server'

// server action to allow configuration of LLM from .env.local

import dotenv from "dotenv";

export async function getLLMServerAction() {
    dotenv.config({ path: `.env.local` });
    return process.env.LLM;
}
