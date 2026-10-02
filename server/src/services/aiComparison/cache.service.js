import pool from "../../db/index.js";

export async function findCachedAiComparison(cacheKey) {
  const result = await pool.query(
    `
      SELECT
        cache_key,
        geography_type,
        place_identifiers,
        personalization,
        provider,
        model,
        prompt_version,
        context_version,
        data_fingerprint,
        response_text,
        input_tokens,
        output_tokens,
        estimated_cost,
        created_at,
        expires_at
      FROM ai_comparison_cache
      WHERE cache_key = $1
        AND expires_at > CURRENT_TIMESTAMP
      LIMIT 1;
    `,
    [cacheKey],
  );

  return result.rows[0] ?? null;
}

export async function saveAiComparison({
  cacheKey,
  geographyType,
  placeIdentifiers,
  personalization,
  provider,
  model,
  promptVersion,
  contextVersion,
  dataFingerprint,
  responseText,
  inputTokens = null,
  outputTokens = null,
  estimatedCost = null,
  expiresAt,
}) {
  const result = await pool.query(
    `
      INSERT INTO ai_comparison_cache (
        cache_key,
        geography_type,
        place_identifiers,
        personalization,
        provider,
        model,
        prompt_version,
        context_version,
        data_fingerprint,
        response_text,
        input_tokens,
        output_tokens,
        estimated_cost,
        expires_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14
      )
      ON CONFLICT (cache_key)
      DO UPDATE SET
        geography_type = EXCLUDED.geography_type,
        place_identifiers = EXCLUDED.place_identifiers,
        personalization = EXCLUDED.personalization,
        provider = EXCLUDED.provider,
        model = EXCLUDED.model,
        prompt_version = EXCLUDED.prompt_version,
        context_version = EXCLUDED.context_version,
        data_fingerprint = EXCLUDED.data_fingerprint,
        response_text = EXCLUDED.response_text,
        input_tokens = EXCLUDED.input_tokens,
        output_tokens = EXCLUDED.output_tokens,
        estimated_cost = EXCLUDED.estimated_cost,
        created_at = CURRENT_TIMESTAMP,
        expires_at = EXCLUDED.expires_at
      RETURNING *;
    `,
    [
      cacheKey,
      geographyType,
      JSON.stringify(placeIdentifiers),
      JSON.stringify(personalization ?? {}),
      provider,
      model,
      promptVersion,
      contextVersion,
      dataFingerprint,
      responseText,
      inputTokens,
      outputTokens,
      estimatedCost,
      expiresAt,
    ],
  );

  return result.rows[0];
}
