import "../../styles/components/metro/MetroPopulationTimeline.css";
import ContextIndicator from "../ui/ContextIndicator";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

function formatMillions(value) {
  return `${(value / 1_000_000).toFixed(1)}M`;
}

export default function MetroPopulationTimeline({ data }) {
  const chartData = Object.entries(data).map(([year, population]) => ({
    year,
    population,
    label: formatMillions(population),
  }));

  const firstYear = chartData[0].year;
  const lastYear = chartData[chartData.length - 1].year;

  const populations = chartData.map((item) => item.population);
  const minPopulation = Math.min(...populations);
  const maxPopulation = Math.max(...populations);
  const populationRange = maxPopulation - minPopulation;

  const yAxisPadding = Math.max(populationRange * 0.8, maxPopulation * 0.02);

  const populationDifference =
    chartData[chartData.length - 1].population - chartData[0].population;

  const isPositive = populationDifference >= 0 ? true : false;

  return (
    <div className="metro-population-timeline">
      <div className="metro-population-timeline__header">
        <h2>Population Over Time</h2>
        <p>{`${firstYear} - ${lastYear} Population Estimates`}</p>
      </div>

      <div className="metro-population-timeline__chart">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={chartData}
            margin={{
              top: 28,
              right: 24,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="metroPopulationGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />

            <XAxis
              dataKey="year"
              padding={{ left: 35, right: 35 }}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />

            <YAxis
              domain={[
                Math.max(0, minPopulation - yAxisPadding),
                maxPopulation + yAxisPadding,
              ]}
              tickFormatter={formatMillions}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              width={56}
            />

            <Area
              type="monotone"
              dataKey="population"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              fill="url(#metroPopulationGradient)"
              activeDot={{ r: 6 }}
              dot={{
                r: 4,
                fill: "#ffffff",
                stroke: "#8b5cf6",
                strokeWidth: 2,
              }}
            >
              <LabelList
                dataKey="label"
                position="top"
                offset={10}
                fill="var(--text)"
                fontSize={12}
                fontWeight={700}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="metro-population-timeline__change">
        Total change since {firstYear}:{" "}
        <ContextIndicator
          tone={isPositive ? "positive" : "negative"}
          value={Math.abs(populationDifference).toLocaleString()}
          direction={!isPositive ? "down" : "up"}
        />
      </p>
    </div>
  );
}
