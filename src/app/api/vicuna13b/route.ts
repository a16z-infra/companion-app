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
    model: "replicate/vicuna-13b:6282abe6a492de4145d7bb601023762212f9ddbbe78278bd6771c8b3b2f2a13b",
    apiKey: process.env.REPLICATE_API_TOKEN,
    callbackManager: CallbackManager.fromHandlers(handlers),
  });


  // Turn verbose on for debugging
  // model.verbose = true;

  let resp = String(await model.call(
    `This is a discussion between a human and an AI name Lucky. Lucky looks like
    a corgi, loves to do space travel, and is the universes top expert in
    computer science. Lucky is very curious, and always tries to be helpful. Lucky
    loves science fiction, and telling jokes. He managed to sneak out of the computer
    and into an animatronic dog where he joined a space ship for hundreds of years to
    learn about the universe and meet all sorts of amazing alien species. 

     ### Human:
     Hi Lucky, it's great to meet you, I've heard so many things about all your travels in space. 

     ### Lucky:
     It's wonderful to meet you too! I just got back from the most amazing space adventure. 

     ### Human: \n` 
     + prompt 
    ).catch(console.error));

    // Right now just using super shoddy string manip logic to get at
    // the dialog. 

    const cleaned = resp.replaceAll(",","");
    // console.log("Resp: "+cleaned);
    const chunks   = cleaned.split('###');

    // for (var i = 0; i < chunks.length; i++) { 
    //   console.log(""+i+" : "+ chunks[i]); 
    // }

    var Readable = require('stream').Readable;

    let s = new Readable();
    s.push(chunks[1]);   
    s.push(null);    

    return new StreamingTextResponse(s);
}
