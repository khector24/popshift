import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "../../styles/components/PopulationTimeline.css";
import ResourceLink from "./ResourceLink";

export default function PopulationTimeline({ title, data }) {
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
            />

            <YAxis
              domain={[320000000, 340000000]}
              tickFormatter={(value) => `${Math.round(value / 1000000)}M`}
              width={60}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
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
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <ResourceLink
        label="Source"
        text="U.S. Census Bureau"
        url="https://www.census.gov/"
      />
    </div>
  );
}
