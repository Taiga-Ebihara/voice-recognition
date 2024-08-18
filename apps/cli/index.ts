import fs from "fs";
import path from "path";
// @ts-ignore
import * as recorder from "node-record-lpcm16";
// @ts-ignore
import player from "play-sound";
import {
  createChatProcessor,
  createSpeechToTextProcessor,
  createTextToSpeechProcessor,
} from "@voice-recognition/core";

const inputAudioPath = path.resolve(__dirname, "./assets/input.wav");
const outputAudioPath = path.resolve(__dirname, "./assets/output.wav");

async function speechToText(): Promise<string> {
  const container = createSpeechToTextProcessor({ type: "openAI" });
  if (container.type !== "openAI") {
    throw new Error("Unsupported S2TProcessorType");
  }

  const file = fs.readFileSync(inputAudioPath);

  return container.processor.transcribe({
    audio: file,
  });
}

async function chatCompletion(prompt: string): Promise<string> {
  const container = createChatProcessor({ type: "openAI" });
  if (container.type !== "openAI") {
    throw new Error("Unsupported ChatProcessorType");
  }

  const stream = container.processor.streamCompletion({
    prompt,
    options: {
      messages: [
        {
          role: "system",
          content: "以下の質問になるべく140文字以内で答えてください。",
        },
      ],
    },
  });

  let res = "";
  for await (const chunk of stream) {
    res += chunk;
    console.log("Completion:", chunk);
  }

  return res;
}

async function textToSpeech(text: string): Promise<void> {
  const container = createTextToSpeechProcessor({ type: "openAI" });
  if (container.type !== "openAI") {
    throw new Error("Unsupported T2SProcessorType");
  }

  const buffer = await container.processor.createSpeech({
    text,
    options: {
      speed: 1.1,
    },
  });
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
