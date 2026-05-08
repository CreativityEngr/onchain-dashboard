const { MAX_REASONABLE_FLOW_USD, STABLECOINS } = require("../config/constants");
const { isKnownFlowAsset } = require("../utils/analytics");
const { rawToAmount } = require("../utils/numbers");

const getRisk = (txs, portfolio, nativeSymbol, nativePrice, flow) => {
  let unknownTokenCount = 0;
  let largestOutflowUSD = 0;

  for (const tx of txs) {
    const symbol = (tx.symbol || "").toUpperCase();

    if (!isKnownFlowAsset(symbol, nativeSymbol)) {
      unknownTokenCount += 1;
      continue;
    }

    if (tx.type !== "sent") continue;

    const amount = rawToAmount(tx.value, tx.tokenDecimal);
    const usd = STABLECOINS.has(symbol) ? amount : amount * nativePrice;

    if (usd > largestOutflowUSD && usd <= MAX_REASONABLE_FLOW_USD) {
      largestOutflowUSD = usd;
    }
  }

  const latestTxTime = txs[0]?.timestamp || 0;
  const oldestTxTime = txs[txs.length - 1]?.timestamp || latestTxTime;
  const activeHours = Math.max((latestTxTime - oldestTxTime) / 3600, 1);
  const txPerHour = txs.length / activeHours;
  const totalPortfolioUSD = portfolio.reduce((sum, item) => sum + item.usd, 0);
  const topHoldingUSD = Math.max(0, ...portfolio.map((item) => item.usd));
  const concentration = totalPortfolioUSD ? topHoldingUSD / totalPortfolioUSD : 0;
  const knownTokenCount = portfolio.length;

  let score = 0;

  if (largestOutflowUSD >= 1_000_000 || flow.outflow >= 2_000_000) score += 25;
  else if (largestOutflowUSD >= 100_000 || flow.outflow >= 250_000) score += 15;

  if (unknownTokenCount >= 15) score += 25;
  else if (unknownTokenCount >= 5) score += 15;
  else if (unknownTokenCount >= 1) score += 5;

  if (txs.length >= 40 && txPerHour >= 10) score += 20;
  else if (txs.length >= 20 && txPerHour >= 5) score += 12;

  if (totalPortfolioUSD >= 10_000 && knownTokenCount <= 1) score += 12;
  else if (totalPortfolioUSD >= 10_000 && knownTokenCount === 2) score += 6;

  if (totalPortfolioUSD >= 10_000 && concentration >= 0.95) score += 18;
  else if (totalPortfolioUSD >= 10_000 && concentration >= 0.8) score += 10;

  const riskScore = Math.min(100, Math.round(score));
  const riskLevel = riskScore >= 70 ? "High" : riskScore >= 35 ? "Medium" : "Low";

  return { riskScore, riskLevel };
};

const getStablecoinFlow = (txs) =>
  txs.reduce((total, tx) => {
    const symbol = (tx.symbol || "").toUpperCase();
    if (!STABLECOINS.has(symbol)) return total;

    return total + rawToAmount(tx.value, tx.tokenDecimal);
  }, 0);

const getTags = (usdValue, txs, flow, walletAge) => {
  const tags = new Set();
  const stablecoinFlow = getStablecoinFlow(txs);
  const walletAgeDays = walletAge
    ? (Date.now() / 1000 - walletAge) / 86400
    : null;

  if (usdValue >= 1_000_000 || flow.inflow + flow.outflow >= 2_000_000) {
    tags.add("Whale");
  }

  if (usdValue >= 100_000 && stablecoinFlow >= 250_000 && txs.length >= 20) {
    tags.add("Smart Money");
  }

  if (txs.length >= 40 || flow.inflow + flow.outflow >= 500_000) {
    tags.add("Active Trader");
  }

  if (walletAgeDays !== null && walletAgeDays <= 30) {
    tags.add("Fresh Wallet");
  }

  if (walletAgeDays !== null && walletAgeDays >= 365 && txs.length <= 25) {
    tags.add("Long-Term Holder");
  }

  return [...tags];
};

module.exports = {
  getRisk,
  getTags,
};
