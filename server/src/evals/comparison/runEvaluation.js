import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildComparisonPrompt } from "../../services/aiComparison/prompt.js";
import { getAvailableProviders, getProviderRunner } from "./providers/index.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const geography = process.argv[2];
const caseName = process.argv[3];
const providerName = process.argv[4] ?? "dry-run";

if (!geography || !caseName) {
  console.error(
    "Usage: node server/src/evals/comparison/runEvaluation.js <geography> <case-name> [provider]",
  );
  console.error("");
  console.error("Examples:");
  console.error("  cities two-places openai");
  console.error("  metros three-places gemini");
  console.error("  states missing-data openai");
  console.error("");
  console.error("Available providers:");
  getAvailableProviders().forEach((name) => console.error("  - " + name));
  process.exit(1);
}

const casesDirectory = path.join(
  currentDirectory,
  "cases",
  geography,
);

if (!fs.existsSync(casesDirectory)) {
  throw new Error(
    `Unknown geography "${geography}". Expected a directory under cases/.`,
  );
}

const availableCases = fs
  .readdirSync(casesDirectory)
  .filter((name) => name.endsWith(".json"))
  .map((name) => name.replace(".json", ""))
  .sort();

if (!availableCases.includes(caseName)) {
  throw new Error(
    `Unknown evaluation case "${caseName}" for geography "${geography}". ` +
      `Available cases: ${availableCases.join(", ")}`,
  );
}

const fixturePath = path.join(
  casesDirectory,
  caseName + ".json",
);

const context = JSON.parse(
  fs.readFileSync(fixturePath, "utf8"),
);

const prompt = buildComparisonPrompt(context);
const runProvider = getProviderRunner(providerName);

const startedAt = performance.now();

const providerResult = await runProvider({
  prompt,
  context,
  caseName,
});

const measuredLatencyMs = Math.round(
  performance.now() - startedAt,
);

const result = {
  provider: providerResult.provider,
  model: providerResult.model,
  geography,
  testCase: caseName,
  inputTokens: providerResult.usage?.inputTokens ?? null,
  outputTokens: providerResult.usage?.outputTokens ?? null,
  thinkingTokens: providerResult.usage?.thinkingTokens ?? null,
  totalTokens: providerResult.usage?.totalTokens ?? null,
  latencyMs: providerResult.latencyMs ?? measuredLatencyMs,
  estimatedCost: providerResult.estimatedCost ?? null,
  errors: providerResult.errors ?? [],
  response: providerResult.response ?? null,
  scores: {
    factualFaithfulness: null,
    comparisonQuality: null,
    missingDataHandling: null,
    personalization: null,
    clarity: null,
    conciseness: null,
  },
  hardFailures: [],
  notes: "",
};

const resultSet = process.env.EVAL_RESULT_SET ?? "baseline";

const resultsDirectory = path.join(
  currentDirectory,
  "results",
  resultSet,
  providerName,
  geography,
);

fs.mkdirSync(resultsDirectory, { recursive: true });

const resultPath = path.join(
  resultsDirectory,
  caseName + ".json",
);

fs.writeFileSync(
  resultPath,
  JSON.stringify(result, null, 2) + "\n",
);

console.log(JSON.stringify(result, null, 2));
console.error("Saved evaluation result to " + resultPath);
