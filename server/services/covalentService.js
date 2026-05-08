const axios = require("axios");

const { rawToAmount, safeNumber } = require("../utils/numbers");

const getCovalentItems = async (address, config) => {
  const key = process.env.COVALENT_API_KEY;
  if (!key) return [];

  try {
    const url = `https://api.covalenthq.com/v1/${config.covalentChain}/address/${address}/transactions_v3/page/0/`;
    const res = await axios.get(url, {
      params: {
        "no-logs": false,
        page_size: 100,
      },
      headers: {
        Authorization: `Bearer ${key}`,
      },
      timeout: 15000,
    });

    return Array.isArray(res.data?.data?.items) ? res.data.data.items : [];
  } catch {
    return [];
  }
};

const getPortfolio = async (address, config) => {
  const key = process.env.COVALENT_API_KEY;
  if (!key) return [];

  try {
    const url = `https://api.covalenthq.com/v1/${config.covalentChain}/address/${address}/balances_v2/`;
    const res = await axios.get(url, {
      params: { "no-spam": true },
      headers: {
        Authorization: `Bearer ${key}`,
      },
      timeout: 15000,
    });
    const items = Array.isArray(res.data?.data?.items)
      ? res.data.data.items
      : [];

    return items
      .map((item) => ({
        symbol: item.contract_ticker_symbol || "",
        amount: rawToAmount(item.balance, item.contract_decimals),
        usd: safeNumber(item.quote),
      }))
      .filter((item) => item.symbol && item.amount > 0 && item.usd > 0)
      .sort((a, b) => b.usd - a.usd);
  } catch {
    return [];
  }
};

module.exports = {
  getCovalentItems,
  getPortfolio,
};
