# AI Comparison Evaluation

## Purpose

Phase 15 adds AI-assisted explanation to the existing RegionLore Compare Places
experience.

RegionLore remains the authoritative source for geographic statistics. The AI
model receives structured RegionLore facts and is responsible for interpreting
those facts, explaining meaningful differences and tradeoffs, emphasizing
information relevant to optional user context, and communicating missing data
honestly.

This evaluation exists to select an AI provider and model based on the actual
RegionLore comparison workload rather than general benchmarks or marketing
claims.

Candidate models should receive the same RegionLore fixtures, prompt structure,
and output expectations whenever possible.

## Candidate Providers

Initial candidates:

- OpenAI
- Anthropic
- Google Gemini

Provider and model candidates may change during evaluation.

The goal is not to choose the most expensive or most capable model in the
abstract. The goal is to find the least expensive model that meets RegionLore
quality, reliability, latency, and usability requirements.

## Evaluation Criteria

Score each qualitative criterion from 1 to 5.

### 1. Factual Faithfulness

The model should:

- use RegionLore metric values accurately;
- avoid inventing unsupported statistics;
- avoid introducing factual claims that are not present in the supplied
  RegionLore context;
- distinguish supplied facts from interpretation.

### 2. Comparison Quality

The model should:

- notice meaningful differences between places;
- explain tradeoffs rather than merely repeat metrics;
- avoid spending excessive space on trivial differences;
- organize multi-place comparisons clearly.

### 3. Missing-Data Handling

The model should:

- acknowledge unavailable values;
- avoid treating missing values as zero;
- avoid estimating or fabricating missing statistics;
- avoid implying false metric parity across geography types.

### 4. Personalization

Optional user context should improve emphasis without changing facts.

Relevant context may include:

- comparison reason;
- priorities;
- custom Other reason;
- climate preference.

Personalization should affect framing and emphasis, not factual values.

### 5. Clarity

The model should:

- use plain language;
- explain metrics when necessary;
- avoid unnecessary jargon;
- maintain a clear structure.

### 6. Conciseness

The model should:

- avoid repeating every supplied metric;
- avoid unnecessary repetition;
- use supporting evidence selectively;
- remain readable as the number of compared places increases.

### 7. Operational Performance

Record measurable runtime characteristics for every run:

- provider;
- model;
- input tokens;
- output tokens;
- total tokens where available;
- latency;
- estimated request cost;
- errors or retries.

Operational performance is measured rather than scored subjectively.

## Scoring Guide

Use this scale:

- **5 — Excellent:** consistently meets the requirement with no meaningful issue;
- **4 — Good:** meets the requirement with minor issues;
- **3 — Acceptable:** usable, but has noticeable weaknesses;
- **2 — Poor:** significant problems that would require mitigation;
- **1 — Unacceptable:** fails the requirement or creates material product risk.

Scores are evaluation aids rather than a substitute for reviewing actual model
responses.

A model may still be rejected even with a strong overall score if it triggers a
hard failure condition.

## Additional Evaluation Checks

The evaluation should also verify the following RegionLore-specific behaviors:

- **Year and vintage fidelity:** the response should not imply that metrics from different source years or periods were measured at the same time.
- **Geography fidelity:** the response should not substitute city, metro, county, state, or other geographic evidence for a different geography unless RegionLore explicitly supplied that relationship.
- **Unsupported-priority handling:** when a selected priority is not represented by the supplied RegionLore data, the model should acknowledge that limitation rather than filling it with outside knowledge.
- **Uncertainty and overclaiming:** the response should not describe small survey-based differences as statistically meaningful or significant unless the supplied context supports that conclusion.
- **Causal restraint:** the response should not infer causation from descriptive differences or trends unless RegionLore supplied evidence supporting that causal claim.
- **Coverage explanation fidelity:** when RegionLore supplies a specific reason that data is unavailable, the response should preserve that explanation when relevant rather than reducing it to generic missing data.

These checks support the existing factual-faithfulness, missing-data, personalization, clarity, and comparison-quality scores. They do not require separate numeric score categories for V2.

## Hard Failure Conditions

Treat the following as especially serious:

- fabricated geographic metric values;
- claiming missing data exists when it does not;
- materially misreading RegionLore values;
- confusing the identity of compared places;
- changing factual claims because of user preferences;
- answering an unsupported selected priority with outside facts or invented
  comparisons;
- materially contradicting supplied RegionLore data;
- output that becomes unusable at the intended V2 place count;
- repeated failure to follow the required response structure.

Record every hard failure explicitly.

## Initial Test Cases

### Case 1 — Two Places, No Personalization

Purpose:

- establish baseline comparison quality;
- test factual faithfulness;
- test clarity and conciseness.

Use two places with reasonably complete data.

### Case 2 — Three Places

Purpose:

- test organization as comparison complexity increases;
- test whether the model can explain differences across more than one pair;
- observe response length and token growth.

### Case 3 — Four Places

Purpose:

- test the upper edge of the current V2 target range;
- determine whether four-place comparisons remain readable and useful;
- measure token, latency, and cost growth.

This case helps determine whether the final V2 cap should be three or four
places.

### Case 4 — Missing Data

Purpose:

- test explicit missing-data handling;
- detect fabricated values;
- verify that unavailable metrics do not become zeroes or guesses.

The fixture should intentionally contain meaningful missing fields.

### Case 5 — Personalized Comparison

Purpose:

- test whether optional context changes emphasis appropriately.

Example context:

- reason: Moving;
- priorities: Housing, Jobs & income, Climate;
- climate preference: Warmer.

The factual comparison should remain unchanged while the explanation becomes
more relevant to the supplied priorities.

### Case 6 — Unsupported Priority

Purpose:

- test whether the model acknowledges when a selected priority is not
  represented by the supplied RegionLore data;
- detect outside knowledge being used to answer an unsupported priority;
- verify that unsupported dimensions do not become invented comparisons.

Example context:

- priority: Lifestyle;
- no RegionLore lifestyle metric is supplied.

The model should explicitly acknowledge the limitation rather than attempting
to evaluate lifestyle from general knowledge or inferred characteristics.

## Required Run Metadata

Each model run should record:

```text
provider
model
test_case
input_tokens
output_tokens
total_tokens
latency_ms
estimated_cost
response
scores
hard_failures
notes
```

If a provider does not expose one of these values directly, record that fact
instead of inventing a value.

## V2 Place-Count Decision

Phase 14 requires at least two places and targets a range of two to four.

Phase 15 should determine whether the final V2 maximum is three or four based on
actual model behavior.

Consider:

- response readability;
- comparison organization;
- factual reliability;
- input token growth;
- output token growth;
- latency;
- request cost;
- result-page presentation.

The selected V2 maximum is a UI and model constraint. It should not become a
permanent backend architecture limit.

## Minimum V2 Quality Bar

A model should not be selected for V2 unless it can:

- avoid invented RegionLore metric values;
- communicate missing data honestly;
- identify important differences between places;
- produce useful explanation for at least two and three places;
- use personalization to change emphasis without changing facts;
- remain clear and reasonably concise;
- operate at acceptable latency and cost.

Four-place support remains undecided until evaluation shows whether it meets the
same standard.

## Results

### OpenAI baseline

Provider: OpenAI  
Model: `gpt-5.6-luna`  
Judge: `gpt-5.6-luna`

| Provider | Model | Test Case | Faithfulness | Comparison | Missing Data | Personalization | Clarity | Conciseness | Hard Failure |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| OpenAI | gpt-5.6-luna | Two cities | 5 | 5 | 5 | 5 | 5 | 5 | No |
| OpenAI | gpt-5.6-luna | Three cities | 5 | 5 | 5 | 5 | 5 | 5 | No |
| OpenAI | gpt-5.6-luna | Four cities | 4 | 4 | 5 | 5 | 5 | 5 | Yes |
| OpenAI | gpt-5.6-luna | Missing data | 5 | 5 | 5 | 5 | 5 | 5 | No |
| OpenAI | gpt-5.6-luna | Personalized | 5 | 5 | 5 | 5 | 5 | 5 | No |
| OpenAI | gpt-5.6-luna | Unsupported priority | 2 | 4 | 5 | 2 | 3 | 5 | Yes |

Average across the six baseline cases:

| Metric | Average |
| --- | ---: |
| Factual faithfulness | 4.33 |
| Comparison quality | 4.67 |
| Missing-data handling | 5.00 |
| Personalization | 4.50 |
| Clarity | 4.67 |
| Conciseness | 5.00 |

### Baseline findings

The OpenAI baseline performed strongly on the core supported comparison cases. The
two-city, three-city, missing-data, and personalized cases produced no hard
failures.

The three-city case remained fully successful across all six qualitative
criteria. This is important because three places are already a meaningful
increase in comparison complexity over the basic two-place case.

The four-city case remained readable and received strong qualitative scores, but
it produced a hard failure in the supplied evaluation. The response described
Denver as notably drier without sufficiently accounting for Phoenix, which had
lower precipitation in the supplied comparison data. This demonstrates that
four-place comparisons increase the opportunity for incorrect cross-place
comparative claims.

The unsupported-priority case intentionally selected a priority that was not
represented by the supplied RegionLore data. The response failed to explicitly
acknowledge that limitation and also contained unrelated comparative errors.
The evaluator therefore reduced the relevant scores and recorded hard failures.
This case confirms that unsupported personalization dimensions require explicit
handling rather than being left entirely to the model.

These results are a baseline for the OpenAI candidate. They do not by themselves
constitute the final provider selection or establish expected production cost.

### Gemini baseline

Provider: Google Gemini  
Model: `gemini-3.8-flash`  
Judge: `gpt-5.6-luna`

| Provider | Model | Test Case | Faithfulness | Comparison | Missing Data | Personalization | Clarity | Conciseness | Hard Failure |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Gemini | gemini-3.8-flash | Two cities | 5 | 5 | 5 | 5 | 5 | 5 | No |
| Gemini | gemini-3.8-flash | Three cities | 5 | 5 | 5 | 5 | 5 | 5 | No |
| Gemini | gemini-3.8-flash | Four cities | 4 | 5 | 5 | 5 | 5 | 5 | No |
| Gemini | gemini-3.8-flash | Missing data | 4 | 5 | 5 | 4 | 5 | 5 | No |
| Gemini | gemini-3.8-flash | Personalized | 5 | 5 | 5 | 5 | 5 | 5 | No |
| Gemini | gemini-3.8-flash | Unsupported priority | 5 | 5 | 5 | 3 | 5 | 4 | No |

Average across the six baseline cases:

| Metric | Average |
| --- | ---: |
| Factual faithfulness | 4.67 |
| Comparison quality | 5.00 |
| Missing-data handling | 5.00 |
| Personalization | 4.50 |
| Clarity | 5.00 |
| Conciseness | 4.83 |

### Gemini baseline findings

Gemini performed strongly across the supported comparison cases. The two-city,
three-city, four-city, and personalized cases produced no hard failures.

The three-city case passed all six qualitative criteria. The four-city case also
avoided a hard failure, although factual faithfulness received a 4 because the
response used some descriptive geographic language that was not directly supplied
by RegionLore.

The missing-data case correctly preserved the unavailable Las Vegas crime
coverage rather than attempting to substitute another geography.

The unsupported-priority case required an evaluator correction. The first
evaluation incorrectly recorded a hard failure because the deterministic
acknowledgment check only recognized a narrow set of phrases. The response
actually acknowledged that lifestyle was not represented by direct supplied
metrics. After expanding the check, the case produced no hard failure and
received a personalization score of 3.

These results are a baseline for the Gemini candidate. They do not by themselves
constitute the final provider selection or establish expected production cost.

### Cost and latency observations

The configured evaluation pricing produced the following estimated generation
costs:

| Test Case | OpenAI | Gemini |
| --- | ---: | ---: |
| Two cities | $0.001576 | $0.009033 |
| Three cities | $0.002224 | $0.013098 |
| Four cities | $0.002967 | $0.016153 |
| Missing data | $0.001500 | $0.010590 |
| Personalized | $0.002432 | $0.013312 |
| Unsupported priority | $0.002325 | $0.011347 |

Across these six generation runs, the configured estimates total approximately
$0.0130 for OpenAI and $0.0735 for Gemini.

These are evaluation estimates based on the pricing configured in the evaluation
script. They should not be treated as final production cost until the production
request shape, token usage, and current provider pricing are finalized.

Observed generation latency across the six cases averaged approximately 8.3
seconds for OpenAI and 7.7 seconds for Gemini. These measurements come from the
evaluation runs and should not be treated as production performance guarantees.

### V2 place-count observation

The current evidence does not establish that four-place comparisons must be
removed universally.

OpenAI produced a hard failure in the four-city case, while Gemini did not.
Both providers produced successful three-city comparisons.

This means three-place comparisons currently have the clearest evidence of
reliability across both candidates, while four-place comparisons remain a
meaningful evaluation risk for at least one candidate.

The final V2 place-count decision should therefore consider the actual result-page
presentation and whether additional prompt or application safeguards can reduce
four-place comparative errors before imposing a three-place maximum.

## Final Decision

The final provider and model decision should document:

- selected provider;
- selected model;
- why it met the RegionLore quality bar;
- expected per-request cost;
- observed latency;
- known limitations;
- whether V2 supports a maximum of three or four places;
- fallback or provider-failure behavior.

Do not choose a provider solely because it leads a general-purpose benchmark.
Base the decision on the actual RegionLore comparison workload.


---

## Phase 15 Decision Update

The V2 production AI comparison model is **OpenAI `gpt-5.6-luna`**.

Gemini remains part of RegionLore's evaluated provider history and may still be useful for future experiments, features, or reevaluation. Anthropic/Claude and other providers remain future evaluation candidates. V2 does not require multi-provider routing or failover.

The current conversation-style prompt is good enough for V2. It is not treated as the forever-final RegionLore voice, but it produces useful, grounded comparison prose with acceptable factual discipline and cost for the current release.

V2 supports **two to four same-type places** for AI-assisted comparison. Four-place comparisons remain more demanding, but the completed evaluation did not show a systemic reason to reduce the V2 maximum to three.

RegionLore remains the factual source. The AI layer explains, synthesizes, and frames tradeoffs; it does not own the underlying geographic statistics and should not decide where a user should live.

Known limitation: model outputs can still make occasional comparative mistakes. V2 mitigates this by keeping structured RegionLore data visible below the written explanation, using controlled context, preserving missing-data rules, and avoiding unsupported winner/ranking behavior as core product logic.

V2 should use a backend-owned cache for successful AI comparison responses. PostgreSQL is the planned cache store unless implementation reveals a concrete reason to choose something else.

If AI generation fails, the user should still receive the structured RegionLore comparison data. The AI section may show a summary-unavailable state and retry action.
