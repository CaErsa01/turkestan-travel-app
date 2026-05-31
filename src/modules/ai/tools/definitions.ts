import { SchemaType, type FunctionDeclaration } from "@google/generative-ai";
import { AI_OPENAI_TOOLS } from "./openai-tools";

function mapJsonType(type: string): SchemaType {
  switch (type) {
    case "number":
      return SchemaType.NUMBER;
    case "array":
      return SchemaType.ARRAY;
    default:
      return SchemaType.STRING;
  }
}

function toGeminiSchema(params: Record<string, unknown>): FunctionDeclaration["parameters"] {
  const props = params.properties as Record<string, Record<string, unknown>> | undefined;
  if (!props) return { type: SchemaType.OBJECT, properties: {} };

  const properties: FunctionDeclaration["parameters"] extends infer P
    ? P extends { properties: infer G }
      ? G
      : never
    : never = {} as FunctionDeclaration["parameters"] extends { properties: infer G }
    ? G
    : never;

  const mapped: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(props)) {
    const t = val.type as string;
    if (t === "array" && val.items) {
      mapped[key] = {
        type: SchemaType.ARRAY,
        items: { type: mapJsonType((val.items as { type: string }).type) },
        description: val.description,
      };
    } else {
      mapped[key] = {
        type: mapJsonType(t),
        description: val.description,
      };
    }
  }

  return {
    type: SchemaType.OBJECT,
    properties: mapped as FunctionDeclaration["parameters"] extends { properties: infer G }
      ? G
      : never,
    required: params.required as string[] | undefined,
  };
}

export const AI_FUNCTION_DECLARATIONS: FunctionDeclaration[] = AI_OPENAI_TOOLS.map((tool) => ({
  name: tool.function.name,
  description: tool.function.description,
  parameters: toGeminiSchema(tool.function.parameters),
}));
