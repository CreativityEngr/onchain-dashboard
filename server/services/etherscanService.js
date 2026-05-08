const axios = require("axios");

const getEtherscanItems = async (address) => {
  const key = process.env.ETHERSCAN_API_KEY;
  if (!key) return [];

  try {
    const [native, tokens] = await Promise.all([
      axios.get("https://api.etherscan.io/v2/api", {
        params: {
          chainid: 1,
          module: "account",
          action: "txlist",
          address,
          page: 1,
          offset: 100,
          sort: "desc",
          apikey: key,
        },
        timeout: 15000,
      }),
      axios.get("https://api.etherscan.io/v2/api", {
        params: {
          chainid: 1,
          module: "account",
          action: "tokentx",
          address,
          page: 1,
          offset: 100,
          sort: "desc",
          apikey: key,
        },
        timeout: 15000,
      }),
    ]);

    const nativeTxs = Array.isArray(native.data?.result)
      ? native.data.result
      : [];
    const tokenTxs = Array.isArray(tokens.data?.result)
      ? tokens.data.result
      : [];

    return [...nativeTxs, ...tokenTxs];
  } catch {
    return [];
  }
};

module.exports = {
  getEtherscanItems,
};
