import MetroStatCard from "./MetroStatCard";
import ContextIndicator from "../ui/ContextIndicator.jsx";

import {
  FaUsers,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaDollarSign,
  FaPeopleRoof,
} from "react-icons/fa6";

import "../../styles/components/metro/MetroHighlights.css";

export default function MetroHighlights({ metro }) {
  const populationSubtitle = `#${metro.rank} Largest Metro in the U.S.`;

  const growthAmount = metro.yearlyGrowth.amount;
  const growthIsPositive = growthAmount >= 0;

  const medianHouseholdIncome = metro.economics.medianHouseholdIncome;
  const nationalIncome = metro.nationalAverages.economics.medianHouseholdIncome;
  const incomeDifferencePercent =
    ((medianHouseholdIncome - nationalIncome) / nationalIncome) * 100;
  const incomeIsAbove = incomeDifferencePercent >= 0;

  const metroPovertyRate = metro.economics.povertyRate;
  const nationalPovertyRate = metro.nationalAverages.economics.povertyRate;
  const povertyDifference = metroPovertyRate - nationalPovertyRate;
  const povertyIsAbove = povertyDifference >= 0;

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
        icon={growthIsPositive ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
        title="Yearly Growth"
        value={`${metro.yearlyGrowth.percent}%`}
        subtitle={
          <ContextIndicator
            direction={growthIsPositive ? "up" : "down"}
            tone={growthIsPositive ? "positive" : "negative"}
            value={Math.abs(growthAmount).toLocaleString()}
            text="people since 2024"
          />
        }
        iconClass={growthIsPositive ? "positive" : "negative"}
      />

      <MetroStatCard
        icon={<FaDollarSign />}
        title="Median Household Income"
        value={`$${medianHouseholdIncome.toLocaleString()}`}
        subtitle={
          <>
            <ContextIndicator
              direction={incomeIsAbove ? "up" : "down"}
              tone={incomeIsAbove ? "positive" : "negative"}
              value={`${Math.abs(incomeDifferencePercent).toFixed(0)}%`}
              text={`${incomeIsAbove ? "above" : "below"} U.S. metro avg`}
            />
            <span> (${nationalIncome.toLocaleString()})</span>
          </>
        }
        iconClass="positive"
      />

      <MetroStatCard
        icon={<FaPeopleRoof />}
        title="Poverty Rate"
        value={`${metroPovertyRate}%`}
        subtitle={
          <>
            <ContextIndicator
              direction={povertyIsAbove ? "up" : "down"}
              tone={povertyIsAbove ? "negative" : "positive"}
              value={`${Math.abs(povertyDifference).toFixed(1)} pp`}
              text={`${povertyIsAbove ? "above" : "below"} U.S. metro avg`}
            />
            <span> ({nationalPovertyRate}%)</span>
          </>
        }
        iconClass="warning"
      />
    </section>
  );
}
