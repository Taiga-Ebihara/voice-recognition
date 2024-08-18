export interface BaseS2TProcessor {
  transcribe(args: { audio: Blob }): Promise<string>;
}
