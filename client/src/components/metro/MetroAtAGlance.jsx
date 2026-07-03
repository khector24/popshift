import "../../styles/components/metro/MetroAtAGlance.css";

function formatNumber(value) {
  return value.toLocaleString();
}

export default function MetroAtAGlance({ metro }) {
  const firstYear = metro.populationYears[0];
  const lastYear = metro.populationYears[metro.populationYears.length - 1];

  const income = metro.economics.medianHouseholdIncome;
  const nationalIncome = metro.nationalAverages.economics.medianHouseholdIncome;
  const incomeDiff = ((income - nationalIncome) / nationalIncome) * 100;

  const firstPopulation = metro.populationByYear[firstYear];
  const lastPopulation = metro.populationByYear[lastYear];

  const populationChange = lastPopulation - firstPopulation;
  const populationChangePercent = (populationChange / firstPopulation) * 100;

  const stateNames = metro.states.map((state) => state.name).join(", ");

  return (
    <div className="metro-at-a-glance">
      <h2>At a Glance</h2>

      <p>
        The {metro.name} is home to {formatNumber(lastPopulation)} people across{" "}
        {metro.states.length} states: {stateNames}.
      </p>

      <p>
        Since {firstYear}, the metro has{" "}
        {populationChange >= 0 ? "added" : "lost"}{" "}
        {formatNumber(Math.abs(populationChange))} residents, a{" "}
        {Math.abs(populationChangePercent).toFixed(1)}%{" "}
        {populationChange >= 0 ? "increase" : "decline"}.
      </p>

      <p>
        It ranks #{metro.rank} among the largest metro areas tracked by
        PopShift.
      </p>

      <p>
        Median household income is ${income.toLocaleString()}, about{" "}
        {Math.abs(incomeDiff).toFixed(0)}% {incomeDiff >= 0 ? "above" : "below"}{" "}
        the U.S. metro average.
      </p>
    </div>
  );
}
