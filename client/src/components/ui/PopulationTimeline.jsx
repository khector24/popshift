import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatPopulation } from "../../utils/formatNumbers.js";

import "../../styles/components/PopulationTimeline.css";
import ResourceLink from "./ResourceLink";

export default function PopulationTimeline({
  title,
  data,
  domain = ["dataMin", "dataMax"],
  showSource = true,
}) {
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
              domain={domain}
              tickFormatter={formatPopulation}
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
