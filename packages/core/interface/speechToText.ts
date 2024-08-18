export interface BaseS2TProcessor {
  transcribe(args: { audio: Buffer }): Promise<string>;
}
