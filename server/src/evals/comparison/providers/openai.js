import OpenAI from "openai";

const model =
  process.env.OPENAI_EVAL_MODEL || "gpt-5.6-luna";

export async function runOpenAI({ prompt }) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const startedAt = performance.now();

  const response = await client.responses.create({
    model,
    instructions: prompt.system,
    input: prompt.user,
  });

  const latencyMs = Math.round(
    performance.now() - startedAt
  );

  return {
    provider: "openai",
    model,
    response: response.output_text,
    usage: {
      inputTokens:
        response.usage?.input_tokens ?? null,
      outputTokens:
        response.usage?.output_tokens ?? null,
      totalTokens:
        response.usage?.total_tokens ?? null,
    },
    latencyMs,
    estimatedCost: null,
    errors: [],
  };
}
