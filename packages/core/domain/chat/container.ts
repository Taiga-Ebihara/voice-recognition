import { OpenAIChatProcessor } from "../../external/opanai/chat";

export type ChatProcessorType = "openAI";

export function createChatProcessor({ type }: { type: ChatProcessorType }) {
  switch (type) {
    case "openAI": {
      return {
        type,
        processor: new OpenAIChatProcessor(),
      };
    }
    default: {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const x: never = type;
      throw new Error(`Unsupported ChatProcessorType`);
    }
  }
}
