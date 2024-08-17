import OpenAI from "openai";
import fs from "fs";
import path from "path";
// @ts-ignore
import * as recorder from "node-record-lpcm16";
// @ts-ignore
import player from "play-sound";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const inputAudioPath = path.resolve(__dirname, "./assets/input.wav");
const outputAudioPath = path.resolve(__dirname, "./assets/output.wav");

async function speechToText(): Promise<string> {
  const file = fs.createReadStream(inputAudioPath);

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
    speed: 1.1,
  });

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(outputAudioPath, buffer);
  console.log("Audio saved to output.wav");
}

function playAudio(filePath: string): void {
  const audioPlayer = player();
  audioPlayer.play(filePath, (err: any) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("Playing audio...");
  });
}

async function main() {
  const text = await speechToText();
  console.log("Transcription:", text);
  const completion = await chatCompletion(text);
  console.log("Result:", completion);
  await textToSpeech(completion);
  playAudio(outputAudioPath);
}

const file = fs.createWriteStream(inputAudioPath, { encoding: "binary" });
const recording = recorder.record().stream().pipe(file);
console.log("Recording...");

process.on("SIGINT", async () => {
  recording.end();
  console.log("Recorded");
  console.log("Transcribing...");
  await main();
  process.exit();
});
