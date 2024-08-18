import { OpenAIS2TProcessor } from "../../external/opanai";

export type S2TProcessorType = "openAI";

export function createSpeechToTextProcessor({
  type,
}: {
  type: S2TProcessorType;
}) {
  switch (type) {
    case "openAI": {
      return {
        type,
        processor: new OpenAIS2TProcessor(),
      };
    }
    default: {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const x: never = type;
      throw new Error(`Unsupported S2TProcessorType`);
    }
  }
}
