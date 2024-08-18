import { type SpeechCreateParams } from "openai/resources/audio/speech";

import { CORE_CONSTANTS } from "../../common/constant";
import { type BaseT2SProcessor } from "../../interface";

import { openAIClient } from "./client";

//
// ref: https://platform.openai.com/docs/api-reference/audio/createSpeech
//

export type OpenAIT2SProcessorOptions = {
  model?: SpeechCreateParams["model"];
  voice?: SpeechCreateParams["voice"];
  responseFormat?: SpeechCreateParams["response_format"];
  speed?: SpeechCreateParams["speed"];
};

export class OpenAIT2SProcessor implements BaseT2SProcessor {
  async createSpeech({
    text,
    options,
  }: {
    text: string;
    options: OpenAIT2SProcessorOptions;
  }): Promise<Blob> {
    const res = await openAIClient.audio.speech.create({
      ...options,
      input: text,
      model: options.model ?? CORE_CONSTANTS.DEFAULT_OPEN_AT_T2S_MODEL,
      voice: options.voice ?? CORE_CONSTANTS.DEFAULT_OPEN_AI_T2S_VOICE,
    });

    return await res.blob();
  }
}
