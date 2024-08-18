export interface BaseT2SProcessor {
  createSpeech(args: { text: string }): Promise<Buffer>;
}
