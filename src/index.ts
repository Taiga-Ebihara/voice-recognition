import OpenAI, { toFile } from "openai";
import fs from "fs";
import path from "path";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

async function main() {
  const filePath = path.resolve(__dirname, "./assets/voice-sample.m4a");
  const file = fs.createReadStream(filePath);

  const res = await client.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  console.log(res);
  fs.writeFileSync("./transcription.json", res.text);
}

main();
