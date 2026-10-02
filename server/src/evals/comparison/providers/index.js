import { runDryRun } from "./dryRun.js";
import { runOpenAIEvaluation } from "../../../services/aiComparison/openai.js";
import { runGemini } from "./gemini.js";

const providers = {
  "dry-run": runDryRun,
  openai: runOpenAIEvaluation,
  gemini: runGemini,
};

export function getProviderRunner(providerName) {
  const runner = providers[providerName];

  if (!runner) {
    throw new Error(
      "Unknown provider: " +
        providerName +
        ". Available providers: " +
        Object.keys(providers).join(", ")
    );
  }

  return runner;
}

export function getAvailableProviders() {
  return Object.keys(providers);
}
