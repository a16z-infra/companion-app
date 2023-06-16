import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const text = `Hi.\n\nI'm Harrison.\n\nHow? Are? You?\nOkay then f f f f.
// This is a weird text to write, but gotta test the splittingggg some how.\n\n
// Bye!\n\n-H.`;

export default async function splitContent(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 1,
  });
  const output = await splitter.createDocuments([text]);
  return output;
}
