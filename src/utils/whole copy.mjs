import dotenv from "dotenv";

dotenv.config({ path: `.env.local` });
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const output = await replicate.run(
  "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
  {
    input: {
      prompt: "a vision of paradise. unreal engine"
    }
  }
);

console.log(output)