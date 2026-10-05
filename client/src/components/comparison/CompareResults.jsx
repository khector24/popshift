import { FaArrowUp, FaChartColumn } from "react-icons/fa6";
import AiComparisonSummary from "./AiComparisonSummary.jsx";
import StructuredComparison from "./StructuredComparison.jsx";
import "../../styles/components/comparison/CompareResults.css";

export default function CompareResults({
  geographyType,
  comparisonResult,
  aiResult,
  aiLoading,
  aiError,
  onAiRetry,
  onEditComparison,
}) {
  if (!comparisonResult) {
    return null;
  }

  return (
    <section className="compare-results">
      <div className="compare-results__toolbar">
        <div className="compare-results__heading">
          <div className="compare-results__icon" aria-hidden="true">
            <FaChartColumn />
          </div>

          <div>
            <p className="compare-results__label">Comparison results</p>
            <p className="compare-results__places">
              {comparisonResult.places
                .map((place) => place.identity?.name || place.name)
                .filter(Boolean)
                .join(" vs. ")}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="compare-results__edit"
          onClick={onEditComparison}
        >
          <FaArrowUp aria-hidden="true" />
          <span>Edit comparison</span>
        </button>
      </div>

      <AiComparisonSummary
        result={aiResult}
        loading={aiLoading}
        error={aiError}
        onRetry={onAiRetry}
      />

      <StructuredComparison
        geographyType={geographyType}
        places={comparisonResult.places}
      />
    </section>
  );
}
