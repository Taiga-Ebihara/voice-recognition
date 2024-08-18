import { toFile } from "openai";
import { type TranscriptionCreateParams } from "openai/resources/audio/transcriptions";

import { CORE_CONSTANTS } from "../../common/constant";
import { type BaseS2TProcessor } from "../../interface/speechToText/base";

import { openAIClient } from "./client";

//
// ref: https://platform.openai.com/docs/api-reference/audio/createTranscription
//

export type OpenAIS2TProcessorOptions = {
  model?: TranscriptionCreateParams["model"];
  prompt?: TranscriptionCreateParams["prompt"];
  language?: TranscriptionCreateParams["language"];
  responseFormat?: TranscriptionCreateParams["response_format"];
  temperature?: TranscriptionCreateParams["temperature"];
  timestampGranularities?: TranscriptionCreateParams["timestamp_granularities"];
};

export class OpenAIS2TProcessor implements BaseS2TProcessor {
  async transcribe({
    audio,
    options,
  }: {
    audio: Blob;
    options: OpenAIS2TProcessorOptions;
  }): Promise<string> {
    const file = await toFile(audio);

    const res = await openAIClient.audio.transcriptions.create({
      ...options,
      file,
      model: options.model ?? CORE_CONSTANTS.DEFAULT_OPEN_AI_S2T_MODEL,
    });

    return res.text;
  }
}
