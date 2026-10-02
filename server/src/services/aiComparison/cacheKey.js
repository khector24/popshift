import crypto from "node:crypto";

function stableStringify(value) {
  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.keys(value)
      .sort()
      .map(
        (key) =>
          JSON.stringify(key) + ":" + stableStringify(value[key]),
      );

    return "{" + entries.join(",") + "}";
  }

  return JSON.stringify(value);
}

function sha256(value) {
  return crypto
    .createHash("sha256")
    .update(stableStringify(value))
    .digest("hex");
}

export function createDataFingerprint(aiContext) {
  return sha256(aiContext);
}

export function createAiComparisonCacheKey({
  geographyType,
  placeIdentifiers,
  personalization,
  provider,
  model,
  promptVersion,
  contextVersion,
  dataFingerprint,
}) {
  return sha256({
    geographyType,
    placeIdentifiers,
    personalization: personalization ?? {},
    provider,
    model,
    promptVersion,
    contextVersion,
    dataFingerprint,
  });
}
