import { FaWandMagicSparkles } from "react-icons/fa6";
import "../../styles/components/comparison/AiComparisonSummary.css";

export default function AiComparisonSummary({
  result,
  loading,
  error,
  onRetry,
}) {
  return (
    <section className="ai-comparison-summary">
      <header className="ai-comparison-summary__header">
        <div className="ai-comparison-summary__icon" aria-hidden="true">
          <FaWandMagicSparkles />
        </div>

        <div>
          <h2>Your comparison</h2>
          <p className="ai-comparison-summary__eyebrow">
            Based on RegionLore data · AI-generated summary
          </p>
        </div>
      </header>

      {loading && (
        <div
          className="ai-comparison-summary__loading"
          role="status"
          aria-live="polite"
        >
          <div className="ai-comparison-summary__spinner" aria-hidden="true" />

          <div>
            <p className="ai-comparison-summary__loading-title">
              Building your comparison...
            </p>

            <p className="ai-comparison-summary__loading-text">
              Reviewing RegionLore data and your priorities.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="ai-comparison-summary__error" role="alert">
          <p>{error}</p>

          <button type="button" onClick={onRetry} disabled={loading}>
            Retry
          </button>
        </div>
      )}

      {result?.summary && (
        <div className="ai-comparison-summary__content">{result.summary}</div>
      )}
    </section>
  );
}
