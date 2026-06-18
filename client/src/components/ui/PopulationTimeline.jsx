import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import {
  formatChartPopulation,
  formatPopulation,
} from "../../utils/formatNumbers.js";

import "../../styles/components/PopulationTimeline.css";
import ResourceLink from "./ResourceLink";

function buildChartScale(data, fixedDomain, tickCount = 5) {
  if (fixedDomain) {
    const [min, max] = fixedDomain;
    const step = (max - min) / (tickCount - 1);

    return {
      domain: fixedDomain,
      ticks: Array.from(
        { length: tickCount },
        (_, index) => min + step * index,
      ),
    };
  }

  const values = data.map((item) => item.population);

  if (values.length === 0) {
    return {
      domain: [0, 1],
      ticks: [0, 0.25, 0.5, 0.75, 1],
    };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || max * 0.1 || 1;
  const padding = range * 0.25;

  const paddedMin = min - padding;
  const paddedMax = max + padding;
  const paddedRange = paddedMax - paddedMin;
  const step = paddedRange / (tickCount - 1);

  return {
    domain: [paddedMin, paddedMax],
    ticks: Array.from(
      { length: tickCount },
      (_, index) => paddedMin + step * index,
    ),
  };
}

export default function PopulationTimeline({
  title,
  data,
  fixedDomain = null,
  tickCount = 5,
  showSource = true,
  showLabels = false,
}) {
  const { domain, ticks } = buildChartScale(data, fixedDomain, tickCount);

  return (
    <div className="population-timeline">
      <h2>{title}</h2>

      <div className="population-timeline__chart">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="populationGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />

            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              padding={{ left: 30, right: 30 }}
              tick={{ fill: "var(--text-muted)", fontWeight: 700 }}
            />

            <YAxis
              domain={domain}
              ticks={ticks}
              tickFormatter={formatChartPopulation}
              width={70}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
              tick={{ fill: "var(--text-muted)", fontWeight: 700 }}
            />

            <Area
              type="monotone"
              dataKey="population"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#populationGradient)"
              dot={{
                r: 4,
                fill: "#ffffff",
                stroke: "#8b5cf6",
                strokeWidth: 2,
              }}
            >
              {showLabels && (
                <LabelList
                  dataKey="population"
                  position="top"
                  offset={12}
                  formatter={formatPopulation}
                  fill="#ffffff"
                  fontSize={12}
                  fontWeight={700}
                />
              )}
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {showSource && (
        <ResourceLink
          label="Source"
          text="U.S. Census Bureau"
          url="https://www.census.gov/"
        />
      )}
    </div>
  );
}
