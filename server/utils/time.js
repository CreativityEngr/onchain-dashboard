const { safeNumber, safeString } = require("./numbers");

const toUnixTime = (date) => {
  const timestamp = Date.parse(date);
  return Number.isFinite(timestamp) ? Math.floor(timestamp / 1000) : null;
};

const normalizeTimestamp = (timestamp) => {
  if (typeof timestamp === "number") return timestamp > 0 ? timestamp : null;
  if (/^\d+$/.test(safeString(timestamp))) return safeNumber(timestamp);
  return toUnixTime(timestamp);
};

const formatCoinGeckoDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
};

module.exports = {
  formatCoinGeckoDate,
  normalizeTimestamp,
  toUnixTime,
};
