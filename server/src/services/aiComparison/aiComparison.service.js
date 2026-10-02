import {
  buildCityComparison,
  buildMetroComparison,
  buildStateComparison,
} from "../comparison.service.js";

import { buildAiContext } from "./buildAiContext.js";
import { buildComparisonPrompt } from "./prompt.js";
import {
  createAiComparisonCacheKey,
  createDataFingerprint,
} from "./cacheKey.js";
import {
  findCachedAiComparison,
  saveAiComparison,
} from "./cache.service.js";
import {
  AI_COMPARISON_MODEL,
  AI_COMPARISON_PROVIDER,
  generateAiComparison,
} from "./openai.js";

const PROMPT_VERSION = "conversation-style-v1";
const CONTEXT_VERSION = "v1";
const CACHE_TTL_DAYS = 30;

async function buildAuthoritativeComparison({
  geographyType,
  placeIdentifiers,
}) {
  if (geographyType === "city") {
    return buildCityComparison(placeIdentifiers);
  }

  if (geographyType === "metro") {
    return buildMetroComparison(placeIdentifiers);
  }

  if (geographyType === "state") {
    return buildStateComparison(placeIdentifiers);
  }

  return null;
}

export async function buildAiComparisonContext({
  geographyType,
  placeIdentifiers,
  personalization = {},
}) {
  const comparison = await buildAuthoritativeComparison({
    geographyType,
    placeIdentifiers,
  });

  if (!comparison) {
    return null;
  }

  return buildAiContext({
    geographyType,
    places: comparison.places,
    personalization,
  });
}

export async function generateComparisonExplanation({
  geographyType,
  placeIdentifiers,
  personalization = {},
}) {
  const aiContext = await buildAiComparisonContext({
    geographyType,
    placeIdentifiers,
    personalization,
  });

  if (!aiContext) {
    return null;
  }

  const dataFingerprint =
    createDataFingerprint(aiContext);

  const cacheKey = createAiComparisonCacheKey({
    geographyType,
    placeIdentifiers,
    personalization,
    provider: AI_COMPARISON_PROVIDER,
    model: AI_COMPARISON_MODEL,
    promptVersion: PROMPT_VERSION,
    contextVersion: CONTEXT_VERSION,
    dataFingerprint,
  });

  const cached =
    await findCachedAiComparison(cacheKey);

  if (cached) {
    return {
      summary: cached.response_text,
      cached: true,
    };
  }

  const prompt = buildComparisonPrompt(aiContext);

  const result = await generateAiComparison({
    prompt,
  });

  const summary = result.response?.trim();

  if (!summary) {
    throw new Error(
      "AI comparison returned an empty response.",
    );
  }

  const expiresAt = new Date(
    Date.now() +
      CACHE_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  await saveAiComparison({
    cacheKey,
    geographyType,
    placeIdentifiers,
    personalization,
    provider: result.provider,
    model: result.model,
    promptVersion: PROMPT_VERSION,
    contextVersion: CONTEXT_VERSION,
    dataFingerprint,
    responseText: summary,
    inputTokens: result.usage?.inputTokens ?? null,
    outputTokens: result.usage?.outputTokens ?? null,
    estimatedCost: result.estimatedCost ?? null,
    expiresAt,
  });

  return {
    summary,
    cached: false,
  };
}
