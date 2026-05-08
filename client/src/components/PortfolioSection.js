import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import EmptyChart from "./EmptyChart";
import { CHART_COLORS } from "../constants/dashboard";
import { getPortfolioChartData } from "../utils/charts";
import { formatUSD } from "../utils/formatters";

function PortfolioSection({ portfolio = [] }) {
  const portfolioChartData = getPortfolioChartData(portfolio);
  const total = portfolio.reduce((sum, item) => sum + item.usd, 0);

  return (
    <>
      <h3 style={{ marginTop: "20px" }}>Portfolio</h3>

      {portfolioChartData.length > 0 ? (
        <div
          className="chart-box portfolio-chart"
          style={{ height: "220px", width: "100%" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="78%"
                paddingAngle={3}
                stroke="#111827"
                strokeWidth={2}
              >
                {portfolioChartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1f2937",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
                formatter={(value) => [formatUSD(value), "Value"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyChart message="No portfolio allocation available" />
      )}

      {portfolio.map((asset, index) => {
        const percent = total ? (asset.usd / total) * 100 : 0;

        return (
          <div key={`${asset.symbol}-${index}`} style={{ marginBottom: "10px" }}>
            <p>
              <span
                style={{
                  background: CHART_COLORS[index % CHART_COLORS.length],
                  borderRadius: "999px",
                  display: "inline-block",
                  height: "8px",
                  marginRight: "6px",
                  width: "8px",
                }}
              />
              {asset.symbol} - {percent.toFixed(1)}%
            </p>

            <div
              style={{
                background: "#1f2937",
                height: "6px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: "6px",
                  background: CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
            </div>
            <p
              style={{
                color: "#64748b",
                fontSize: "12px",
                margin: "5px 0 0",
              }}
            >
              {formatUSD(asset.usd)}
            </p>
          </div>
        );
      })}
    </>
  );
}

export default PortfolioSection;
