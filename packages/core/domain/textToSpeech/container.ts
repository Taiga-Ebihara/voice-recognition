import { OpenAIT2SProcessor } from "../../external/opanai";

export type T2SProcessorType = "openAI";

export function createTextToSpeechProcessor({
  type,
}: {
  type: T2SProcessorType;
}) {
  switch (type) {
    case "openAI": {
      return {
        type,
        processor: new OpenAIT2SProcessor(),
      };
    }
    default: {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const x: never = type;
      throw new Error(`Unsupported T2SProcessorType`);
    }
  }
}
