import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import InfoTooltip from "./InfoTooltip.jsx";

import { formatChartPopulation } from "../../utils/formatNumbers.js";
import "../../styles/components/ComparePopulationChart.css";

import { compareColors } from "../../utils/compareColors.js";

function buildChartScale(data, states, tickCount = 5) {
  const values = [];

  data.forEach((year) => {
    states.forEach((state) => {
      if (year[state.name]) {
        values.push(year[state.name]);
      }
    });
  });

  if (values.length === 0) {
    return {
      domain: [0, 1],
      ticks: [0, 0.25, 0.5, 0.75, 1],
    };
  }

  const max = Math.max(...values);
  const paddedMax = max * 1.15;

  const roundedMax = Math.ceil(paddedMax / 5000000) * 5000000;
  const step = roundedMax / (tickCount - 1);

  return {
    domain: [0, roundedMax],
    ticks: Array.from({ length: tickCount }, (_, i) => step * i),
  };
}

function formatTooltipValue(value) {
  return value.toLocaleString();
}

export default function ComparePopulationChart({ data, states }) {
  const { domain, ticks } = buildChartScale(data, states);

  return (
    <div className="compare-population-chart">
      <h2>
        Population Over Time
        <InfoTooltip text="Shows each selected state's population trend from 2020 to 2025." />{" "}
      </h2>
      <div className="compare-population-chart__chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 36,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />

            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              padding={{ left: 30, right: 30 }}
              tick={{
                fill: "var(--text-muted)",
                fontWeight: 700,
              }}
            />

            <YAxis
              domain={domain}
              ticks={ticks}
              tickFormatter={formatChartPopulation}
              width={70}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,.15)" }}
              tick={{
                fill: "var(--text-muted)",
                fontWeight: 700,
              }}
            />

            <Tooltip
              formatter={(value) => formatTooltipValue(value)}
              contentStyle={{
                backgroundColor: "#162036",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "10px",
              }}
            />
            <Legend verticalAlign="top" align="center" iconType="line" />

            {states.map((state, index) => (
              <Area
                key={state.code}
                dataKey={state.name}
                stroke={compareColors[index]}
                fillOpacity={0}
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#ffffff",
                  stroke: compareColors[index],
                  strokeWidth: 2,
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
