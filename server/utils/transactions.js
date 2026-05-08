const { safeString } = require("./numbers");
const { normalizeTimestamp } = require("./time");

const getDecodedParam = (params, names) => {
  const allowedNames = new Set(names);

  return params.find((param) => {
    const normalizedName = String(param.name || "")
      .replace(/^_/, "")
      .toLowerCase();

    return allowedNames.has(normalizedName);
  })?.value;
};

const getAddress = (value) =>
  safeString(typeof value === "object" && value !== null ? value.address : value)
    .toLowerCase();

const normalizeCovalentTxs = (items, address, config) => {
  const wallet = address.toLowerCase();
  const txs = [];

  for (const item of items) {
    const timestamp = normalizeTimestamp(item.block_signed_at);

    if (item.value && item.value !== "0") {
      const from = safeString(item.from_address).toLowerCase();
      const to = safeString(item.to_address).toLowerCase();

      txs.push({
        hash: safeString(item.tx_hash),
        from,
        to,
        value: safeString(item.value, "0"),
        symbol: config.nativeSymbol,
        timestamp,
        type: to === wallet ? "received" : "sent",
        tokenSymbol: config.nativeSymbol,
        tokenDecimal: "18",
      });
    }

    const logs = Array.isArray(item.log_events) ? item.log_events : [];
    for (const log of logs) {
      const decoded = log.decoded;
      if (decoded?.name !== "Transfer") continue;

      const params = Array.isArray(decoded.params) ? decoded.params : [];
      const from = safeString(getDecodedParam(params, ["from", "sender"]))
        .toLowerCase();
      const to = safeString(getDecodedParam(params, ["to", "receiver"]))
        .toLowerCase();
      const value = getDecodedParam(params, ["value"]);

      if (!value || (!from && !to)) continue;
      if (from !== wallet && to !== wallet) continue;

      const decimals = Number.isFinite(Number(log.sender_contract_decimals))
        ? Number(log.sender_contract_decimals)
        : 18;
      const symbol = safeString(log.sender_contract_ticker_symbol).toUpperCase();
      if (!symbol) continue;

      txs.push({
        hash: safeString(item.tx_hash),
        from,
        to,
        value: safeString(value, "0"),
        symbol,
        timestamp,
        type: to === wallet ? "received" : "sent",
        tokenSymbol: symbol,
        tokenDecimal: String(decimals),
      });
    }
  }

  return txs;
};

const normalizeGlacierTxs = ({ native, erc20 }, address, config) => {
  const wallet = address.toLowerCase();
  const nativeTxs = native.map((tx) => {
    const from = getAddress(tx.from);
    const to = getAddress(tx.to);

    return {
      hash: safeString(tx.txHash),
      from,
      to,
      value: safeString(tx.value, "0"),
      symbol: config.nativeSymbol,
      timestamp: normalizeTimestamp(tx.blockTimestamp),
      type: to === wallet ? "received" : "sent",
      tokenSymbol: config.nativeSymbol,
      tokenDecimal: "18",
    };
  });

  const tokenTxs = erc20.map((tx) => {
    const from = getAddress(tx.from);
    const to = getAddress(tx.to);
    const token = tx.erc20Token || {};
    const symbol = safeString(token.symbol).toUpperCase();

    return {
      hash: safeString(tx.txHash),
      from,
      to,
      value: safeString(tx.value, "0"),
      symbol: symbol || "TOKEN",
      timestamp: normalizeTimestamp(tx.blockTimestamp),
      type: to === wallet ? "received" : "sent",
      tokenSymbol: symbol || "TOKEN",
      tokenDecimal: safeString(token.decimals, "18"),
    };
  });

  return [...nativeTxs, ...tokenTxs].filter(
    (tx) => tx.from === wallet || tx.to === wallet
  );
};

const normalizeEtherscanTxs = (items, address, config) => {
  const wallet = address.toLowerCase();

  return items
    .map((tx) => {
      const isToken = Boolean(tx.tokenSymbol);
      const symbol = isToken
        ? tx.tokenSymbol.toUpperCase()
        : config.nativeSymbol;

      return {
        hash: safeString(tx.hash),
        from: safeString(tx.from).toLowerCase(),
        to: safeString(tx.to).toLowerCase(),
        value: safeString(tx.value, "0"),
        symbol,
        timestamp: normalizeTimestamp(tx.timeStamp),
        type: safeString(tx.to).toLowerCase() === wallet ? "received" : "sent",
        tokenSymbol: symbol,
        tokenDecimal: isToken ? safeString(tx.tokenDecimal, "18") : "18",
      };
    })
    .filter((tx) => tx.from === wallet || tx.to === wallet);
};

const sortTransactions = (txs) =>
  txs
    .filter((tx) => tx.hash && tx.timestamp > 0 && tx.value && tx.value !== "0")
    .sort((a, b) => b.timestamp - a.timestamp);

module.exports = {
  normalizeCovalentTxs,
  normalizeEtherscanTxs,
  normalizeGlacierTxs,
  sortTransactions,
};
