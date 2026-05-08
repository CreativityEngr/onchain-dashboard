export const formatUSD = (num) => {
  if (!num) return "$0";
  const n = Number(num);
  const sign = n < 0 ? "-" : "";
  const value = Math.abs(n);

  if (value >= 1e9) return `${sign}$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${sign}$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${sign}$${(value / 1e3).toFixed(2)}K`;

  return `${sign}$${value.toFixed(2)}`;
};

export const formatToken = (value) => Number(value || 0).toLocaleString();

export const formatAge = (timestamp) => {
  if (!timestamp) return "N/A";

  const now = Date.now();
  const past = Number(timestamp) * 1000;
  const diff = now - past;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y ago`;
  return `${days}d ago`;
};

export const formatSignedUSD = (value) => {
  const amount = Number(value || 0);
  return `${amount > 0 ? "+" : ""}${formatUSD(amount)}`;
};

export const formatSignedPercent = (value) => {
  const amount = Number(value || 0);
  return `${amount > 0 ? "+" : ""}${amount.toFixed(2)}%`;
};

export const shortAddress = (value) =>
  value ? `${value.slice(0, 6)}...${value.slice(-4)}` : "";
