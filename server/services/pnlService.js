const {
  MIN_PNL_ACQUIRED_RATIO,
  SUPPORTED_PNL_ASSETS,
} = require("../config/constants");
const { rawToAmount, safeNumber, safeString } = require("../utils/numbers");
const { getHistoricalPrice } = require("./priceService");

const unavailablePnl = () => ({
  totalUsd: null,
  totalPercent: null,
  assets: [],
  status: "Unavailable",
});

const getPnl = async (txs, nativeBalance, config, nativePrice) => {
  const symbol = config.nativeSymbol;
  const holdingAmount = safeNumber(nativeBalance);
  if (!SUPPORTED_PNL_ASSETS.has(symbol) || !holdingAmount || !nativePrice) {
    return unavailablePnl();
  }

  const receivedTxs = txs
    .filter(
      (tx) =>
        tx.type === "received" &&
        safeString(tx.symbol).toUpperCase() === symbol
    )
    .sort((a, b) => a.timestamp - b.timestamp);

  if (!receivedTxs.length) return unavailablePnl();

  let acquiredAmount = 0;
  let acquiredCost = 0;

  for (const tx of receivedTxs) {
    const amount = rawToAmount(tx.value, tx.tokenDecimal);
    if (!amount || amount <= 0) continue;

    const entryPrice = await getHistoricalPrice(symbol, tx.timestamp);
    if (!entryPrice) continue;

    acquiredAmount += amount;
    acquiredCost += amount * entryPrice;
  }

  if (!acquiredAmount || acquiredAmount / holdingAmount < MIN_PNL_ACQUIRED_RATIO) {
    return unavailablePnl();
  }

  const averageEntry = acquiredCost / acquiredAmount;
  const currentValue = holdingAmount * nativePrice;
  const entryValue = holdingAmount * averageEntry;
  const pnlUsd = currentValue - entryValue;
  const pnlPercent = entryValue ? (pnlUsd / entryValue) * 100 : 0;

  return {
    totalUsd: pnlUsd,
    totalPercent: pnlPercent,
    assets: [
      {
        symbol,
        amount: holdingAmount,
        currentValue,
        entryValue,
        pnlUsd,
        pnlPercent,
        averageEntry,
        currentPrice: nativePrice,
      },
    ],
    status: "Estimated",
  };
};

module.exports = {
  getPnl,
  unavailablePnl,
};
