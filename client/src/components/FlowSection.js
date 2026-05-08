import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import EmptyChart from "./EmptyChart";
import { getFlowChartData } from "../utils/charts";
import { formatUSD } from "../utils/formatters";

function FlowSection({ wallet }) {
  const flowChartData = getFlowChartData(wallet);
  const hasFlowChartData = flowChartData.some((item) => item.value > 0);

  return (
    <>
      <h3>Flow</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <div>
          <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>
            Inflow
          </p>
          <p style={{ color: "#22c55e", marginTop: "4px" }}>
            {formatUSD(wallet.inflow)}
          </p>
        </div>
        <div>
          <p style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>
            Outflow
          </p>
          <p style={{ color: "#ef4444", marginTop: "4px" }}>
            {formatUSD(wallet.outflow)}
          </p>
        </div>
      </div>

      {hasFlowChartData ? (
        <div className="chart-box" style={{ height: "190px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={flowChartData}
              margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickFormatter={formatUSD}
              />
              <Tooltip
                cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1f2937",
                  borderRadius: "8px",
                  color: "#e5e7eb",
                }}
                formatter={(value) => [formatUSD(value), "USD"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {flowChartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyChart message="No flow data available" />
      )}

      <p
        style={{
          marginTop: "10px",
          color: wallet.netFlow >= 0 ? "#22c55e" : "#ef4444",
        }}
      >
        Net: {formatUSD(wallet.netFlow)}
      </p>
    </>
  );
}

export default FlowSection;
