export async function runDryRun({ prompt }) {
  return {
    provider: "dry-run",
    model: "none",
    response: null,
    usage: {
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    },
    latencyMs: 0,
    estimatedCost: null,
    errors: [],
  };
}
