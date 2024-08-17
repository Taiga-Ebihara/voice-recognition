import OpenAI from "openai";
import fs from "fs";
import path from "path";
// @ts-ignore
import * as recorder from "node-record-lpcm16";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const filePath = path.resolve(__dirname, "./assets/sample.wav");

async function speechToText(): Promise<string> {
  const file = fs.createReadStream(filePath);

  const res = await client.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  return res.text;
}

async function chatCompletion(prompt: string): Promise<string> {
  const stream = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-4o-mini",
    stream: true,
  });

  let res = "";
  for await (const chunk of stream) {
    res += chunk.choices[0]?.delta.content;
    console.log("Completion:", chunk.choices[0]?.delta.content);
  }

  return res;
}

async function textToSpeech(text: string): Promise<void> {
  const res = await client.audio.speech.create({
    model: "tts-1",
    input: text,
    voice: "nova",
  });

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(path.resolve(__dirname, "./assets/output.wav"), buffer);
  console.log("Audio saved to output.wav");
}

async function main() {
  const text = await speechToText();
  console.log("Transcription:", text);
  const completion = await chatCompletion(text);
  console.log("Result:", completion);
  await textToSpeech(completion);
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
