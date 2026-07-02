import MetroStatCard from "./MetroStatCard";
import {
  FaUsers,
  FaArrowTrendUp,
  FaDollarSign,
  FaPeopleRoof,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa6";

import "../../styles/components/metro/MetroHighlights.css";
import {
  formatPercentDifference,
  formatPointDifference,
} from "../../utils/metroContextUtils";

export default function MetroHighlights({ metro }) {
  const populationSubtitle = `#${metro.rank} Largest Metro in the U.S.`;

  const medianHouseholdIncome = metro.economics.medianHouseholdIncome;
  const nationalIncome = metro.nationalAverages.economics.medianHouseholdIncome;
  const medianIncomeSubtitle = formatPercentDifference(
    medianHouseholdIncome,
    nationalIncome,
  );

  const metroPovertyRate = metro.economics.povertyRate;
  const nationalPovertyRate = metro.nationalAverages.economics.povertyRate;
  const povertyRateSubtitle = formatPointDifference(
    metroPovertyRate,
    nationalPovertyRate,
  );

  const growthIsPositive = metro.yearlyGrowth.amount >= 0;
  const GrowthArrow = growthIsPositive ? FaArrowUp : FaArrowDown;

  return (
    <section className="metro-highlights">
      <MetroStatCard
        icon={<FaUsers />}
        title="Population"
        value={metro.population.toLocaleString()}
        subtitle={populationSubtitle}
        iconClass="purple"
      />

      <MetroStatCard
        icon={<FaArrowTrendUp />}
        title="Yearly Growth"
        value={`${metro.yearlyGrowth.percent}%`}
        subtitle={
          <>
            <GrowthArrow className="metro-stat-card__change-icon" />{" "}
            {Math.abs(metro.yearlyGrowth.amount).toLocaleString()} people since
            2024
          </>
        }
        iconClass="green"
      />

      <MetroStatCard
        icon={<FaDollarSign />}
        title="Median Household Income"
        value={`$${medianHouseholdIncome.toLocaleString()}`}
        subtitle={`${medianIncomeSubtitle} (${nationalIncome.toLocaleString()})`}
        iconClass="green"
      />

      <MetroStatCard
        icon={<FaPeopleRoof />}
        title="Poverty Rate"
        value={`${metroPovertyRate}%`}
        subtitle={`${povertyRateSubtitle} (${nationalPovertyRate})`}
        iconClass="orange"
      />
    </section>
  );
}
