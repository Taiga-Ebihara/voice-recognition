export interface BaseChatProcessor {
  completion(args: { prompt: string }): Promise<string>;
  streamCompletion(args: { prompt: string }): AsyncGenerator<string>;
}
