import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const resultDirectory = path.join(
  currentDirectory,
  "results",
  "baseline",
);

const pricing = {
  openai: {
    inputPerMillion: 0.20,
    outputPerMillion: 1.20,
  },
  gemini: {
    inputPerMillion: 0.75,
    outputPerMillion: 3.75,
  },
};

for (const providerName of fs.readdirSync(resultDirectory)) {
  const providerDirectory = path.join(
    resultDirectory,
    providerName,
  );

  if (!fs.statSync(providerDirectory).isDirectory()) {
    continue;
  }

  const providerPricing = pricing[providerName];

  if (!providerPricing) {
    console.log(
      `Skipping ${providerName}: no pricing configured.`,
    );
    continue;
  }

  for (const geography of fs.readdirSync(providerDirectory)) {
    const geographyDirectory = path.join(
      providerDirectory,
      geography,
    );

    if (!fs.statSync(geographyDirectory).isDirectory()) {
      continue;
    }

    for (const fileName of fs.readdirSync(geographyDirectory)) {
      if (!fileName.endsWith(".json")) {
        continue;
      }

      const filePath = path.join(
        geographyDirectory,
        fileName,
      );

      const result = JSON.parse(
        fs.readFileSync(filePath, "utf8"),
      );

      if (
        typeof result.inputTokens !== "number" ||
        typeof result.outputTokens !== "number"
      ) {
        console.log(
          `Skipping ${providerName}/${geography}/${fileName}: missing token counts.`,
        );
        continue;
      }

      const outputTokens =
        result.outputTokens +
        (result.thinkingTokens ?? 0);

      result.estimatedCost =
        result.inputTokens *
          providerPricing.inputPerMillion /
          1_000_000 +
        outputTokens *
          providerPricing.outputPerMillion /
          1_000_000;

      fs.writeFileSync(
        filePath,
        JSON.stringify(result, null, 2) + "\n",
      );

      console.log(
        `${providerName}/${geography}/${fileName}: $${result.estimatedCost.toFixed(6)}`,
      );
    }
  }
}
