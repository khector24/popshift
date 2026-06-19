import "../../styles/components/CompareTable.css";
import { formatGrowth } from "../../utils/growthUtils.js";
import {
  compareMetrics,
  formatCompareMetric,
} from "../../utils/compareUtils.js";

export default function CompareTable({ states }) {
  return (
    <div className="compare-table">
      <table>
        <thead>
          <tr>
            <th>Metric</th>

            {states.map(
              (state, index) =>
                state && <th key={`${state.code}-${index}`}>{state.name}</th>,
            )}
          </tr>
        </thead>

        <tbody>
          {compareMetrics.map((metric) => (
            <tr key={metric.key}>
              <td>{metric.label}</td>

              {states.map(
                (state, index) =>
                  state && (
                    <td
                      key={`${state.code}-${metric.key}-${index}`}
                      className={
                        metric.key === "growth"
                          ? formatGrowth(state.growth).growthClassName
                          : ""
                      }
                    >
                      {formatCompareMetric(state, metric.key)}
                    </td>
                  ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
