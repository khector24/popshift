import OpenAI from "openai";

export const AI_COMPARISON_PROVIDER = "openai";
export const AI_COMPARISON_MODEL = "gpt-5.6-luna";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runOpenAIWithModel({ prompt, model }) {
  const startedAt = performance.now();

  const response = await client.responses.create({
    model,
    instructions: prompt.system,
    input: prompt.user,
  });

  const latencyMs = Math.round(
    performance.now() - startedAt,
  );

  return {
    provider: AI_COMPARISON_PROVIDER,
    model,
    response: response.output_text,
    usage: {
      inputTokens: response.usage?.input_tokens ?? null,
      outputTokens: response.usage?.output_tokens ?? null,
      totalTokens: response.usage?.total_tokens ?? null,
    },
    latencyMs,
    estimatedCost: null,
    errors: [],
  };
}

export function generateAiComparison({ prompt }) {
  return runOpenAIWithModel({
    prompt,
    model: AI_COMPARISON_MODEL,
  });
}

export function runOpenAIEvaluation({ prompt }) {
  return runOpenAIWithModel({
    prompt,
    model:
      process.env.OPENAI_EVAL_MODEL ||
      AI_COMPARISON_MODEL,
  });
}
