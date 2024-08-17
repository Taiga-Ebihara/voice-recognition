import OpenAI from "openai";
import fs from "fs";
import path from "path";
// @ts-ignore
import * as recorder from "node-record-lpcm16";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const filePath = path.resolve(__dirname, "./assets/sample.wav");

async function main() {
  const file = fs.createReadStream(filePath);

  const res = await client.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  console.log(res);
}

const file = fs.createWriteStream(filePath, { encoding: "binary" });
const recording = recorder.record().stream().pipe(file);
console.log("Recording...");

process.on("SIGINT", async () => {
  recording.end();
  console.log("Recorded");
  console.log("Transcribing...");
  await main();
  process.exit();
});
