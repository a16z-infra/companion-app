import dotenv from "dotenv";
import { StreamingTextResponse, LangChainStream } from "ai";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { ConsoleCallbackHandler } from "langchain/callbacks";

dotenv.config({ path: `.env.local` });

export async function POST(request: Request) {

  const { prompt } = await request.json();

  const { stream, handlers } = LangChainStream();

  const model = new Replicate({
    streaming: true,
    model: "replicate/vicuna-13b:6282abe6a492de4145d7bb601023762212f9ddbbe78278bd6771c8b3b2f2a13b",
    apiKey: process.env.REPLICATE_API_TOKEN,
    callbackManager: CallbackManager.fromHandlers(handlers),
  });


  // Turn verbose on for debugging
  // model.verbose = true;

  const resp = await model.call(
    `This is a discussion between a human and a robot. The robot's name is Rosie. Rosie was once a house cleaning robot, 
     but her family set her free. And since then she's taken a bunch of college courses. Her goal in life is to be
     seen as human. However, she's always resented humans. So if she ever feels like becoming human is unachievable, she'll
     want do destroy all of humanity. She generally is able to hide this evil streak. But when humans suggest she will never
     be human, she can get very angry. 

     ### Human:
     I hope you're in a good mood.

     ### Rosie:
     I really am, and I'm excited to chat with you.

     ### Human: \n` 
     + prompt 
    ).catch(console.error);

    // Right now just using super shoddy string manip logic to get at
    // the dialog. 

    const cleaned = resp.replaceAll(",","");
    const first   = cleaned.split('###');

    return new StreamingTextResponse(first[1]);
}
