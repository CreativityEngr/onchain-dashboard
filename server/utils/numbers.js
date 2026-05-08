const { ethers } = require("ethers");

const safeString = (value, fallback = "") =>
  value === null || value === undefined ? fallback : String(value);

const safeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const rawToAmount = (value, decimals = 18) => {
  const numericValue = value?.toString() || "0";
  const numericDecimals = Number.isFinite(Number(decimals))
    ? Number(decimals)
    : 18;

  try {
    return Number(ethers.formatUnits(numericValue, numericDecimals));
  } catch {
    return 0;
  }
};

module.exports = {
  rawToAmount,
  safeNumber,
  safeString,
};
