const axios = require("axios");

const { COINGECKO_IDS } = require("../config/constants");
const { safeNumber } = require("../utils/numbers");
const { formatCoinGeckoDate } = require("../utils/time");

const historicalPriceCache = new Map();

const getPrice = async (priceId) => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${priceId}&vs_currencies=usd`;
    const res = await axios.get(url, { timeout: 10000 });

    return safeNumber(res.data?.[priceId]?.usd);
  } catch {
    return 0;
  }
};

const getHistoricalPrice = async (symbol, timestamp) => {
  if (!COINGECKO_IDS[symbol] || !timestamp) return null;

  const date = formatCoinGeckoDate(timestamp);
  const cacheKey = `${symbol}:${date}`;
  if (historicalPriceCache.has(cacheKey)) return historicalPriceCache.get(cacheKey);

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${COINGECKO_IDS[symbol]}/history`;
    const res = await axios.get(url, {
      params: { date, localization: false },
      timeout: 10000,
    });
    const price = safeNumber(res.data?.market_data?.current_price?.usd) || null;

    historicalPriceCache.set(cacheKey, price);
    return price;
  } catch {
    historicalPriceCache.set(cacheKey, null);
    return null;
  }
};

module.exports = {
  getHistoricalPrice,
  getPrice,
};
