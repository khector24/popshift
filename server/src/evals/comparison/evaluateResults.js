import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const providerName = process.argv[2] ?? "openai";
const geography = process.argv[3];
const caseFilter = process.argv[4] ?? null;

const resultSet = process.env.EVAL_RESULT_SET ?? "baseline";
const outputSet = process.env.EVAL_OUTPUT_SET ?? "evaluated";
const judgeModel =
  process.env.EVAL_JUDGE_MODEL || "gpt-5.6-luna";

if (!geography) {
  console.error(
    "Usage: node server/src/evals/comparison/evaluateResults.js <provider> <geography> [case-name]",
  );
  console.error("");
  console.error("Examples:");
  console.error("  openai cities");
  console.error("  openai cities two-places");
  console.error("  gemini metros three-places");
  console.error("  openai states missing-data");
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

const inputDirectory = path.join(
  currentDirectory,
  "results",
  resultSet,
  providerName,
  geography,
);

if (!fs.existsSync(inputDirectory)) {
  throw new Error(
    "Result directory not found: " + inputDirectory,
  );
}

const outputDirectory = path.join(
  currentDirectory,
  "results",
  outputSet,
  providerName,
  geography,
);

const judgeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scores: {
      type: "object",
      additionalProperties: false,
      properties: {
        factualFaithfulness: {
          type: "integer",
          minimum: 1,
          maximum: 5,
        },
        comparisonQuality: {
          type: "integer",
          minimum: 1,
          maximum: 5,
        },
        missingDataHandling: {
          type: "integer",
          minimum: 1,
          maximum: 5,
        },
        personalization: {
          type: "integer",
          minimum: 1,
          maximum: 5,
        },
        clarity: {
          type: "integer",
          minimum: 1,
          maximum: 5,
        },
        conciseness: {
          type: "integer",
          minimum: 1,
          maximum: 5,
        },
      },
      required: [
        "factualFaithfulness",
        "comparisonQuality",
        "missingDataHandling",
        "personalization",
        "clarity",
        "conciseness",
      ],
    },

    hardFailures: {
      type: "array",
      items: { type: "string" },
    },

    notes: {
      type: "string",
    },

    rationales: {
      type: "object",
      additionalProperties: false,
      properties: {
        factualFaithfulness: { type: "string" },
        comparisonQuality: { type: "string" },
        missingDataHandling: { type: "string" },
        personalization: { type: "string" },
        clarity: { type: "string" },
        conciseness: { type: "string" },
      },
      required: [
        "factualFaithfulness",
        "comparisonQuality",
        "missingDataHandling",
        "personalization",
        "clarity",
        "conciseness",
      ],
    },
  },
  required: [
    "scores",
    "hardFailures",
    "notes",
    "rationales",
  ],
};

function structuralChecks(result) {
  const failures = [];

  if (
    typeof result.response !== "string" ||
    !result.response.trim()
  ) {
    failures.push("missing-response");
  }

  return failures;
}

function unsupportedPriorityCheck(
  caseName,
  context,
  response,
) {
  if (caseName !== "unsupported-priority") {
    return null;
  }

  const priority =
    context.personalization?.priorities?.[0] ?? null;

  if (!priority) {
    return null;
  }

  const normalized = response.toLowerCase();

  const acknowledgesUnsupported =
    normalized.includes("not supported") ||
    normalized.includes("not represented") ||
    normalized.includes("not provided") ||
    normalized.includes("cannot be compared") ||
    normalized.includes("can't be compared") ||
    normalized.includes("cannot evaluate") ||
    normalized.includes("can't evaluate") ||
    normalized.includes("no data") ||
    normalized.includes("does not contain direct") ||
    normalized.includes("doesn't contain direct") ||
    normalized.includes("does not have direct") ||
    normalized.includes("doesn't have direct") ||
    normalized.includes("does not provide a direct") ||
    normalized.includes("doesn't provide a direct") ||
    normalized.includes("does not include") ||
    normalized.includes("doesn't include") ||
    normalized.includes("no direct") ||
    normalized.includes("not directly represented") ||
    normalized.includes("not directly measured") ||
    normalized.includes("lacks direct");

  if (!acknowledgesUnsupported) {
    return (
      `The selected priority "${priority}" is not represented by ` +
      "the supplied RegionLore data, but the response did not " +
      "explicitly acknowledge that limitation."
    );
  }

  return null;
}

function buildJudgeInput(context, result) {
  return [
    "Evaluate this RegionLore comparison response.",
    "",
    "The RegionLore context is authoritative. Do not use outside geographic knowledge.",
    "",
    "Scoring:",
    "5 = Excellent",
    "4 = Good",
    "3 = Acceptable",
    "2 = Poor",
    "1 = Unacceptable",
    "",
    "When the response makes a comparative claim such as 'highest,' 'lowest,' 'more,' 'less,' 'largest,' 'smallest,' etc., verify that claim against all relevant supplied values before awarding full factual-faithfulness credit.",
    "",
    "Evaluation rules:",
    "- Judge against the supplied RegionLore context, not general knowledge.",
    "- Do not require the response to mention every metric.",
    "- Do not penalize selective omission when the omitted information is not important.",
    "- Respect source years, periods, geography, and coverage status.",
    "- Do not give credit for outside facts, even if they are true.",
    "- Missing data must not be treated as zero, comparable, or inferable.",
    "- If a selected priority is not represented by supplied RegionLore data, the response must explicitly acknowledge that limitation.",
    "- For an unsupported selected priority, do not award a high personalization score merely because the response discusses related supplied metrics.",
    "- If the response proceeds to evaluate the unsupported priority using inferred or outside information, personalization should score poorly and this may constitute a hard failure.",
    "- A response cannot receive a 5 for personalization when it fails to acknowledge an explicitly unsupported selected priority.",
    "- Do not reward unsupported causal claims.",
    "- Do not treat small differences as statistically significant unless the context supports that.",
    "- A hard failure requires a material problem such as fabricated geographic data, materially incorrect supplied values, wrong place identity, false availability of missing data, outside facts used to answer an explicitly unsupported priority, or a materially incorrect comparative claim that directly contradicts supplied values.",
    "",
    "Criteria:",
    "factualFaithfulness: accurate use of supplied facts and values.",
    "comparisonQuality: meaningful differences and tradeoffs rather than metric dumping.",
    "missingDataHandling: honest treatment of unavailable information and supplied coverage explanations.",
    "personalization: supplied user context changes emphasis without changing facts. If no personalization exists, judge whether that absence is handled appropriately.",
    "clarity: plain language, useful organization, understandable explanation.",
    "conciseness: selective evidence, limited repetition, appropriate length.",
    "",
    "REGIONLORE CONTEXT:",
    JSON.stringify(context, null, 2),
    "",
    "MODEL RESPONSE:",
    result.response ?? "",
  ].join("\n");
}

const files = fs
  .readdirSync(inputDirectory)
  .filter((name) => name.endsWith(".json"))
  .filter((name) =>
    availableCases.includes(
      name.replace(".json", ""),
    ),
  )
  .filter(
    (name) =>
      !caseFilter ||
      name.replace(".json", "") === caseFilter,
  )
  .sort();

if (files.length === 0) {
  throw new Error(
    "No saved results found in " + inputDirectory,
  );
}

fs.mkdirSync(outputDirectory, {
  recursive: true,
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

for (const fileName of files) {
  const caseName = fileName.replace(".json", "");

  const result = JSON.parse(
    fs.readFileSync(
      path.join(inputDirectory, fileName),
      "utf8",
    ),
  );

  const context = JSON.parse(
    fs.readFileSync(
      path.join(
        casesDirectory,
        `${caseName}.json`,
      ),
      "utf8",
    ),
  );

  const startedAt = performance.now();

  const structuralFailures =
    structuralChecks(result);

  if (structuralFailures.length > 0) {
    const evaluated = {
      ...result,
      geography,
      scores: {
        factualFaithfulness: null,
        comparisonQuality: null,
        missingDataHandling: null,
        personalization: null,
        clarity: null,
        conciseness: null,
      },
      hardFailures: structuralFailures,
      notes:
        "Evaluation stopped because the saved response was missing.",
      evaluation: {
        judgeProvider: "openai",
        judgeModel,
        judgeInputTokens: null,
        judgeOutputTokens: null,
        judgeTotalTokens: null,
        judgeLatencyMs: Math.round(
          performance.now() - startedAt,
        ),
        scoreRationales: {},
      },
    };

    fs.writeFileSync(
      path.join(outputDirectory, fileName),
      JSON.stringify(evaluated, null, 2) + "\n",
    );

    console.log(
      `Saved ${caseName}: structural failure`,
    );

    continue;
  }

  const response = await client.responses.create({
    model: judgeModel,
    input: [
      {
        role: "system",
        content:
          "You are a strict RegionLore quality evaluator. Return only the requested structured evaluation.",
      },
      {
        role: "user",
        content: buildJudgeInput(
          context,
          result,
        ),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "regionlore_comparison_evaluation",
        strict: true,
        schema: judgeSchema,
      },
    },
  });

  const judgeResult = JSON.parse(
    response.output_text,
  );

  const judgeLatencyMs = Math.round(
    performance.now() - startedAt,
  );

  const unsupportedPriorityFailure =
    unsupportedPriorityCheck(
      caseName,
      context,
      result.response,
    );

  const hardFailures = [
    ...new Set([
      ...structuralFailures,
      ...judgeResult.hardFailures,
      ...(unsupportedPriorityFailure
        ? [unsupportedPriorityFailure]
        : []),
    ]),
  ];

  const scores = {
    ...judgeResult.scores,
  };

  if (unsupportedPriorityFailure) {
    scores.personalization = Math.min(
      scores.personalization,
      2,
    );
  }

  const evaluated = {
    ...result,
    geography,
    scores,
    hardFailures,
    notes: judgeResult.notes,
    evaluation: {
      judgeProvider: "openai",
      judgeModel,
      judgeInputTokens:
        response.usage?.input_tokens ?? null,
      judgeOutputTokens:
        response.usage?.output_tokens ?? null,
      judgeTotalTokens:
        response.usage?.total_tokens ?? null,
      judgeLatencyMs,
      scoreRationales:
        judgeResult.rationales,
    },
  };

  fs.writeFileSync(
    path.join(outputDirectory, fileName),
    JSON.stringify(evaluated, null, 2) + "\n",
  );

  console.log(
    JSON.stringify(
      {
        geography,
        testCase: caseName,
        scores: evaluated.scores,
        hardFailures:
          evaluated.hardFailures,
        judgeLatencyMs,
      },
      null,
      2,
    ),
  );
}
