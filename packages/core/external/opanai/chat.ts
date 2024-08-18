import { type ChatCompletionCreateParams } from "openai/resources";

import { CORE_CONSTANTS } from "../../common/constant";
import { type BaseChatProcessor } from "../../interface";

import { openAIClient } from "./client";

export type OpenAIChatProcessorOptions = {
  messages?: ChatCompletionCreateParams["messages"];
  model?: ChatCompletionCreateParams["model"];
  frequencyPenalty?: ChatCompletionCreateParams["frequency_penalty"];
  loditBias?: ChatCompletionCreateParams["logit_bias"];
  logprobs?: ChatCompletionCreateParams["logprobs"];
  topLogprobs?: ChatCompletionCreateParams["top_logprobs"];
  maxTokens?: ChatCompletionCreateParams["max_tokens"];
  n?: ChatCompletionCreateParams["n"];
  presencePenalty?: ChatCompletionCreateParams["presence_penalty"];
  responseFormat?: ChatCompletionCreateParams["response_format"];
  seed?: ChatCompletionCreateParams["seed"];
  serviceTier?: ChatCompletionCreateParams["service_tier"];
  stop?: ChatCompletionCreateParams["stop"];
  // stream?: ChatCompletionCreateParams["stream"];
  streamOptions?: ChatCompletionCreateParams["stream_options"];
  temperature?: ChatCompletionCreateParams["temperature"];
  topP?: ChatCompletionCreateParams["top_p"];
  tools?: ChatCompletionCreateParams["tools"];
  toolChoice?: ChatCompletionCreateParams["tool_choice"];
  parallelToolCalls?: ChatCompletionCreateParams["parallel_tool_calls"];
  user?: ChatCompletionCreateParams["user"];
};

export class OpenAIChatProcessor implements BaseChatProcessor {
  async completion({
    prompt,
    options,
  }: {
    prompt: string;
    options?: OpenAIChatProcessorOptions;
  }): Promise<string> {
    const res = await openAIClient.chat.completions.create({
      ...options,
      messages: [
        ...(options?.messages ?? []),
        {
          role: "user",
          content: prompt,
        },
      ],
      model: options?.model ?? CORE_CONSTANTS.DEFAULT_OPEN_AI_CHAT_MODEL,
      // completionではstreamを強制的にfalseにする
      stream: false,
    });

    return res.choices[0]?.message?.content ?? "";
  }

  async *streamCompletion({
    prompt,
    options,
  }: {
    prompt: string;
    options?: OpenAIChatProcessorOptions;
  }): AsyncGenerator<string> {
    const res = await openAIClient.chat.completions.create({
      ...options,
      messages: [
        ...(options?.messages ?? []),
        {
          role: "user",
          content: prompt,
        },
      ],
      model: options?.model ?? CORE_CONSTANTS.DEFAULT_OPEN_AI_CHAT_MODEL,
      // 強制的にstreamをtrueにする
      stream: true,
    });

    for await (const chunk of res) {
      yield chunk.choices[0]?.delta.content ?? "";
    }
  }
}
