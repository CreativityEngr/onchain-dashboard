export const getPortfolioChartData = (portfolio = []) =>
  portfolio
    .filter((item) => Number(item.usd) > 0)
    .slice(0, 6)
    .map((item) => ({
      name: item.symbol,
      value: Number(item.usd),
    }));

export const getFlowChartData = (data) => [
  { name: "Inflow", value: Number(data?.inflow || 0), fill: "#22c55e" },
  { name: "Outflow", value: Number(data?.outflow || 0), fill: "#ef4444" },
];
