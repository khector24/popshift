import "../../styles/components/comparison/StructuredComparison.css";

const categoryLabels = {
  population: "Population",
  economics: "Economy",
  housing: "Housing",
  transportation: "Transportation",
  education: "Education",
  demographics: "Demographics",
  climate: "Climate",
  crime: "Crime",
  migration: "Migration",
};

const categoriesByGeography = {
  city: [
    "population",
    "economics",
    "housing",
    "transportation",
    "education",
    "demographics",
    "crime",
    "climate",
  ],
  metro: [
    "population",
    "economics",
    "housing",
    "transportation",
    "education",
    "migration",
  ],
  state: ["population", "economics", "education", "migration"],
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const crimeMetrics = [
  {
    label: "Violent crime",
    getValue: (crime) => crime?.violentCrime?.rate,
  },
  {
    label: "Murder",
    getValue: (crime) => crime?.violentCrime?.murder?.rate,
  },
  {
    label: "Rape",
    getValue: (crime) => crime?.violentCrime?.rape?.rate,
  },
  {
    label: "Robbery",
    getValue: (crime) => crime?.violentCrime?.robbery?.rate,
  },
  {
    label: "Aggravated assault",
    getValue: (crime) => crime?.violentCrime?.aggravatedAssault?.rate,
  },
  {
    label: "Property crime",
    getValue: (crime) => crime?.propertyCrime?.rate,
  },
  {
    label: "Burglary",
    getValue: (crime) => crime?.propertyCrime?.burglary?.rate,
  },
  {
    label: "Larceny / theft",
    getValue: (crime) => crime?.propertyCrime?.larcenyTheft?.rate,
  },
  {
    label: "Motor vehicle theft",
    getValue: (crime) => crime?.propertyCrime?.motorVehicleTheft?.rate,
  },
];

function formatLabel(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (typeof value === "string") {
    return value;
  }

  return null;
}

function formatTemperature(value) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  return `${value.toLocaleString()}°F`;
}

function formatPrecipitation(value) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  return `${value.toLocaleString()} in`;
}

function formatCrimeRate(value) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function ClimateValue({ data }) {
  if (!data) {
    return "Not available";
  }

  return (
    <div className="structured-comparison__climate-value">
      <span>
        <strong>{formatTemperature(data.normalHigh)}</strong>
        {" / "}
        <strong>{formatTemperature(data.normalLow)}</strong>
      </span>

      <span>Mean {formatTemperature(data.normalMean)}</span>

      <span>{formatPrecipitation(data.precipitation)} precip.</span>
    </div>
  );
}

function ClimateRows({ places }) {
  const months = Array.from(
    new Set(
      places.flatMap((place) =>
        (place.climate?.monthly ?? []).map((entry) => entry.month),
      ),
    ),
  ).sort((a, b) => a - b);

  if (months.length === 0) {
    return null;
  }

  return (
    <section className="structured-comparison__category">
      <h3>Climate</h3>

      <div className="structured-comparison__table-wrapper">
        <table className="structured-comparison__table">
          <thead>
            <tr>
              <th scope="col">Month</th>

              {places.map((place) => (
                <th key={place.identity.name} scope="col">
                  {place.identity.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {months.map((month) => (
              <tr key={month}>
                <th scope="row">{monthNames[month - 1] ?? `Month ${month}`}</th>

                {places.map((place) => {
                  const monthlyData = place.climate?.monthly?.find(
                    (entry) => entry.month === month,
                  );

                  return (
                    <td key={place.identity.name}>
                      <ClimateValue data={monthlyData} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="structured-comparison__note">
        Monthly climate normals show high / low temperature, mean temperature,
        and precipitation using the{" "}
        {places[0]?.climate?.normalPeriod ?? "available"} normal period.
      </p>
    </section>
  );
}

function CrimeRows({ places }) {
  return (
    <section className="structured-comparison__category">
      <h3>Crime</h3>

      <div className="structured-comparison__table-wrapper">
        <table className="structured-comparison__table">
          <thead>
            <tr>
              <th scope="col">Rate per 100,000</th>

              {places.map((place) => (
                <th key={place.identity.name} scope="col">
                  {place.identity.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {crimeMetrics.map((metric) => (
              <tr key={metric.label}>
                <th scope="row">{metric.label}</th>

                {places.map((place) => (
                  <td key={place.identity.name}>
                    {formatCrimeRate(metric.getValue(place.crime))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="structured-comparison__note">
        Crime rates are shown per 100,000 residents. Availability reflects
        RegionLore's FBI city coverage for the reported year.
      </p>
    </section>
  );
}

function MetricRows({ category, places }) {
  if (category === "climate") {
    return <ClimateRows places={places} />;
  }

  if (category === "crime") {
    return <CrimeRows places={places} />;
  }

  const metricKeys = Array.from(
    new Set(
      places.flatMap((place) =>
        Object.entries(place[category] ?? {})
          .filter(([, value]) => formatValue(value) !== null)
          .map(([key]) => key),
      ),
    ),
  );

  if (metricKeys.length === 0) {
    return null;
  }

  return (
    <section className="structured-comparison__category">
      <h3>{categoryLabels[category]}</h3>

      <div className="structured-comparison__table-wrapper">
        <table className="structured-comparison__table">
          <thead>
            <tr>
              <th scope="col">Metric</th>

              {places.map((place) => (
                <th key={place.identity.name} scope="col">
                  {place.identity.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {metricKeys.map((metricKey) => (
              <tr key={metricKey}>
                <th scope="row">{formatLabel(metricKey)}</th>

                {places.map((place) => (
                  <td key={place.identity.name}>
                    {formatValue(place[category]?.[metricKey]) ??
                      "See detailed data"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function StructuredComparison({ geographyType, places }) {
  const categories = categoriesByGeography[geographyType] ?? [];

  return (
    <section className="structured-comparison">
      <div className="structured-comparison__heading">
        <h2>Compare the data</h2>
        <p>RegionLore data used to build this comparison.</p>
      </div>

      {categories.map((category) => (
        <MetricRows key={category} category={category} places={places} />
      ))}
    </section>
  );
}
