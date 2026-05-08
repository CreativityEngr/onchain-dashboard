const {
  LARGE_NATIVE_HOLDINGS,
  MAX_REASONABLE_FLOW_USD,
  STABLECOINS,
  VALUE_THRESHOLDS,
} = require("../config/constants");
const { getAvalancheOldestTimestamp } = require("../services/glacierService");
const { rawToAmount, safeNumber } = require("./numbers");

const isKnownFlowAsset = (symbol, nativeSymbol) =>
  symbol === nativeSymbol || STABLECOINS.has(symbol);

const getWalletAge = async (address, config, txs) => {
  const txAge = txs.length
    ? txs.reduce(
        (earliest, tx) => Math.min(earliest, tx.timestamp),
        txs[0].timestamp
      )
    : null;

  if (config.chainId !== 43114) return txAge;

  const oldestAvaxTimestamp = await getAvalancheOldestTimestamp(address);
  if (!oldestAvaxTimestamp) return txAge;

  return txAge ? Math.min(txAge, oldestAvaxTimestamp) : oldestAvaxTimestamp;
};

const getFlow = (txs, nativeSymbol, nativePrice) => {
  let inflow = 0;
  let outflow = 0;

  for (const tx of txs) {
    const symbol = (tx.symbol || "").toUpperCase();
    if (!isKnownFlowAsset(symbol, nativeSymbol)) continue;

    const amount = rawToAmount(tx.value, tx.tokenDecimal);
    if (!amount || amount < 0) continue;

    const usd = STABLECOINS.has(symbol) ? amount : amount * nativePrice;
    if (!usd || usd > MAX_REASONABLE_FLOW_USD) continue;

    if (tx.type === "received") inflow += usd;
    else outflow += usd;
  }

  return {
    inflow,
    outflow,
    netFlow: inflow - outflow,
  };
};

const getPortfolioValue = (portfolio) =>
  portfolio.reduce((sum, item) => sum + safeNumber(item.usd), 0);

const hasExtremelyLargeNativeHolding = (nativeAmount, nativeSymbol) =>
  nativeAmount >= (LARGE_NATIVE_HOLDINGS[nativeSymbol] || Infinity);

const getBadge = (usdValue, nativeAmount, nativeSymbol) => {
  if (hasExtremelyLargeNativeHolding(nativeAmount, nativeSymbol)) return "Whale";
  if (usdValue >= VALUE_THRESHOLDS.whale) return "Whale";
  if (usdValue >= VALUE_THRESHOLDS.highNetWorth) return "High Net Worth";
  if (usdValue >= VALUE_THRESHOLDS.midHolder) return "Mid Holder";
  return "Retail";
};

module.exports = {
  getBadge,
  getFlow,
  getPortfolioValue,
  getWalletAge,
  isKnownFlowAsset,
};
