import dotenv from "dotenv";

dotenv.config({ path: `.env.local` });
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const output = await replicate.run(
  "replicate/vicuna-13b:6282abe6a492de4145d7bb601023762212f9ddbbe78278bd6771c8b3b2f2a13b",
  {
    input: {
      prompt: "What's your mood today?"
    }
  }
);

console.log(output);