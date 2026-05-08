const axios = require("axios");

const { normalizeTimestamp } = require("../utils/time");

const getGlacierHeaders = () =>
  process.env.GLACIER_API_KEY
    ? { "x-glacier-api-key": process.env.GLACIER_API_KEY }
    : {};

const findBlockTimestamp = (value) => {
  if (!value || typeof value !== "object") return null;
  if (value.blockTimestamp) return normalizeTimestamp(value.blockTimestamp);

  for (const child of Object.values(value)) {
    if (Array.isArray(child)) {
      for (const item of child) {
        const timestamp = findBlockTimestamp(item);
        if (timestamp) return timestamp;
      }
    } else if (child && typeof child === "object") {
      const timestamp = findBlockTimestamp(child);
      if (timestamp) return timestamp;
    }
  }

  return null;
};

const getGlacierTxItems = async (address, action, params = {}) => {
  try {
    const url = `https://data-api.avax.network/v1/chains/43114/addresses/${address}/transactions:${action}`;
    const res = await axios.get(url, {
      params: { pageSize: 100, ...params },
      headers: getGlacierHeaders(),
      timeout: 15000,
    });

    return Array.isArray(res.data?.transactions) ? res.data.transactions : [];
  } catch {
    return [];
  }
};

const getAvalancheGlacierItems = async (address) => {
  const [native, erc20] = await Promise.all([
    getGlacierTxItems(address, "listNative"),
    getGlacierTxItems(address, "listErc20"),
  ]);

  return { native, erc20 };
};

const getAvalancheOldestTimestamp = async (address) => {
  try {
    const url = `https://data-api.avax.network/v1/chains/43114/addresses/${address}/transactions`;
    const res = await axios.get(url, {
      params: { pageSize: 1, sortOrder: "asc" },
      headers: getGlacierHeaders(),
      timeout: 15000,
    });
    const item = Array.isArray(res.data?.transactions)
      ? res.data.transactions[0]
      : null;

    return findBlockTimestamp(item);
  } catch {
    return null;
  }
};

module.exports = {
  getAvalancheGlacierItems,
  getAvalancheOldestTimestamp,
};
