import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

import "../../styles/components/MigrationTimeline.css";

function formatChartMovers(value) {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (absoluteValue >= 1000) {
    return `${Math.round(value / 1000)}K`;
  }

  return value;
}

function formatSignedMovers(value) {
  if (value > 0) return `+${value.toLocaleString()}`;
  return value.toLocaleString();
}

function buildChartScale(data, tickCount = 5) {
  const values = data.map((item) => item.netMigration);

  if (values.length === 0) {
    return {
      domain: [-1, 1],
      ticks: [-1, -0.5, 0, 0.5, 1],
    };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const largestAbsoluteValue = Math.max(Math.abs(min), Math.abs(max), 1);
  const paddedMax = largestAbsoluteValue * 1.25;
  const step = (paddedMax * 2) / (tickCount - 1);

  return {
    domain: [-paddedMax, paddedMax],
    ticks: Array.from(
      { length: tickCount },
      (_, index) => -paddedMax + step * index,
    ),
  };
}

export default function MigrationTimeline({ title, data }) {
  const chartData = [...data].sort((a, b) => a.year - b.year);
  const { domain, ticks } = buildChartScale(chartData);

  return (
    <div className="migration-timeline">
      <h2>{title}</h2>

      <div className="migration-timeline__chart">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id="migrationGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
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
              tickFormatter={formatChartMovers}
              width={70}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
              tick={{ fill: "var(--text-muted)", fontWeight: 700 }}
            />

            <Tooltip
              formatter={(value) => [
                formatSignedMovers(value),
                "Net migration",
              ]}
              contentStyle={{
                backgroundColor: "#162036",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "10px",
              }}
            />

            <Area
              type="monotone"
              dataKey="netMigration"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#migrationGradient)"
              dot={{
                r: 4,
                fill: "#ffffff",
                stroke: "#8b5cf6",
                strokeWidth: 2,
              }}
            >
              <LabelList
                dataKey="netMigration"
                position="top"
                offset={12}
                formatter={formatSignedMovers}
                fill="#ffffff"
                fontSize={12}
                fontWeight={700}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
