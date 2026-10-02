import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

const {
  findCachedAiComparison,
  saveAiComparison,
  generateAiComparison,
} = vi.hoisted(() => ({
  findCachedAiComparison: vi.fn(),
  saveAiComparison: vi.fn(),
  generateAiComparison: vi.fn(),
}));

vi.mock(
  "../services/aiComparison/cache.service.js",
  () => ({
    findCachedAiComparison,
    saveAiComparison,
  }),
);

vi.mock(
  "../services/aiComparison/openai.js",
  () => ({
    AI_COMPARISON_PROVIDER: "openai",
    AI_COMPARISON_MODEL: "gpt-5.6-luna",
    generateAiComparison,
  }),
);

import {
  generateComparisonExplanation,
} from "../services/aiComparison/aiComparison.service.js";

describe("AI comparison service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns a cached explanation without calling OpenAI", async () => {
    findCachedAiComparison.mockResolvedValue({
      response_text: "Cached RegionLore explanation.",
    });

    const result = await generateComparisonExplanation({
      geographyType: "state",
      placeIdentifiers: ["36", "48"],
      personalization: {
        reason: "moving",
        priorities: ["housing"],
      },
    });

    expect(result).toEqual({
      summary: "Cached RegionLore explanation.",
      cached: true,
    });

    expect(findCachedAiComparison).toHaveBeenCalledOnce();
    expect(generateAiComparison).not.toHaveBeenCalled();
    expect(saveAiComparison).not.toHaveBeenCalled();
  });

  test("generates and caches an explanation on a cache miss", async () => {
    findCachedAiComparison.mockResolvedValue(null);

    generateAiComparison.mockResolvedValue({
      provider: "openai",
      model: "gpt-5.6-luna",
      response: "  Fresh RegionLore explanation.  ",
      usage: {
        inputTokens: 100,
        outputTokens: 50,
      },
      estimatedCost: 0.01,
    });

    saveAiComparison.mockResolvedValue({});

    const result = await generateComparisonExplanation({
      geographyType: "state",
      placeIdentifiers: ["36", "48"],
      personalization: {
        reason: "moving",
        priorities: ["housing", "climate"],
        preferences: {
          climate: "warmer",
        },
      },
    });

    expect(result).toEqual({
      summary: "Fresh RegionLore explanation.",
      cached: false,
    });

    expect(generateAiComparison).toHaveBeenCalledOnce();
    expect(saveAiComparison).toHaveBeenCalledOnce();

    expect(saveAiComparison).toHaveBeenCalledWith(
      expect.objectContaining({
        geographyType: "state",
        placeIdentifiers: ["36", "48"],
        provider: "openai",
        model: "gpt-5.6-luna",
        promptVersion: "conversation-style-v1",
        contextVersion: "v1",
        responseText: "Fresh RegionLore explanation.",
        inputTokens: 100,
        outputTokens: 50,
        estimatedCost: 0.01,
        cacheKey: expect.any(String),
        dataFingerprint: expect.any(String),
        expiresAt: expect.any(Date),
      }),
    );
  });

  test("does not cache an empty OpenAI response", async () => {
    findCachedAiComparison.mockResolvedValue(null);

    generateAiComparison.mockResolvedValue({
      provider: "openai",
      model: "gpt-5.6-luna",
      response: "   ",
      usage: {
        inputTokens: 100,
        outputTokens: 0,
      },
      estimatedCost: 0.001,
    });

    await expect(
      generateComparisonExplanation({
        geographyType: "state",
        placeIdentifiers: ["36", "48"],
      }),
    ).rejects.toThrow(
      "AI comparison returned an empty response.",
    );

    expect(saveAiComparison).not.toHaveBeenCalled();
  });

  test("does not cache when OpenAI fails", async () => {
    findCachedAiComparison.mockResolvedValue(null);

    generateAiComparison.mockRejectedValue(
      new Error("OpenAI unavailable"),
    );

    await expect(
      generateComparisonExplanation({
        geographyType: "state",
        placeIdentifiers: ["36", "48"],
      }),
    ).rejects.toThrow("OpenAI unavailable");

    expect(saveAiComparison).not.toHaveBeenCalled();
  });
});
