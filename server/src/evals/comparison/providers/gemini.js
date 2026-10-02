import { GoogleGenAI } from "@google/genai";

const model = process.env.GEMINI_EVAL_MODEL || "gemini-3.8-flash";

const maxAttempts = 4;

function isRetryableError(error) {
  const status = error?.status ?? error?.code;

  return (
    status === 408 ||
    status === 429 ||
    (typeof status === "number" && status >= 500 && status <= 599)
  );
}

function isQuotaExhausted(error) {
  const message = error?.message ?? "";

  return (
    message.includes("GenerateRequestsPerDayPerModel") ||
    message.includes("generate_content_free_tier_requests")
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runGemini({ prompt }) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const startedAt = performance.now();
  const errors = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt.user,
        config: {
          systemInstruction: prompt.system,
        },
      });

      const latencyMs = Math.round(performance.now() - startedAt);

      return {
        provider: "gemini",
        model,
        response: response.text,
        usage: {
          inputTokens: response.usageMetadata?.promptTokenCount ?? null,
          outputTokens: response.usageMetadata?.candidatesTokenCount ?? null,
          thinkingTokens: response.usageMetadata?.thoughtsTokenCount ?? null,
          totalTokens: response.usageMetadata?.totalTokenCount ?? null,
        },
        latencyMs,
        estimatedCost: null,
        errors,
      };
    } catch (error) {
      const status = error?.status ?? error?.code;

      errors.push({
        attempt,
        status: status ?? null,
        message: error?.message ?? String(error),
      });

      if (
        isQuotaExhausted(error) ||
        !isRetryableError(error) ||
        attempt === maxAttempts
      ) {
        const latencyMs = Math.round(performance.now() - startedAt);

        return {
          provider: "gemini",
          model,
          response: null,
          usage: {
            inputTokens: null,
            outputTokens: null,
            thinkingTokens: null,
            totalTokens: null,
          },
          latencyMs,
          estimatedCost: null,
          errors,
        };
      }

      const baseDelayMs = 1000 * 2 ** (attempt - 1);
      const jitterMs = Math.floor(Math.random() * 250);

      await delay(baseDelayMs + jitterMs);
    }
  }

  throw new Error("Gemini evaluation failed unexpectedly.");
}
