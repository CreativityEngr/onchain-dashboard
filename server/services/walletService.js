const {
  normalizeCovalentTxs,
  normalizeEtherscanTxs,
  normalizeGlacierTxs,
  sortTransactions,
} = require("../utils/transactions");
const {
  getAvalancheGlacierItems,
} = require("./glacierService");
const { getCovalentItems, getPortfolio } = require("./covalentService");
const { getEtherscanItems } = require("./etherscanService");
const { getNativeBalance } = require("./providerService");
const { getPrice } = require("./priceService");
const { getPnl, unavailablePnl } = require("./pnlService");
const { getRisk, getTags } = require("./scoringService");
const {
  getBadge,
  getFlow,
  getPortfolioValue,
  getWalletAge,
} = require("../utils/analytics");
const { safeNumber } = require("../utils/numbers");

const getTransactions = async (address, config) => {
  const covalentTxs = normalizeCovalentTxs(
    await getCovalentItems(address, config),
    address,
    config
  );

  if (covalentTxs.length) {
    return sortTransactions(covalentTxs);
  }

  if (config.chainId === 43114) {
    return sortTransactions(
      normalizeGlacierTxs(
        await getAvalancheGlacierItems(address),
        address,
        config
      )
    );
  }

  return sortTransactions(
    normalizeEtherscanTxs(await getEtherscanItems(address), address, config)
  );
};

const fallbackResponse = (address, config) => ({
  address,
  chain: config.label,
  balance: "0",
  usd: 0,
  walletAge: null,
  badge: "Retail",
  inflow: 0,
  outflow: 0,
  netFlow: 0,
  riskScore: 0,
  riskLevel: "Low",
  tags: [],
  pnl: unavailablePnl(),
  portfolio: [],
  txs: [],
});

const getWalletAnalytics = async (address, config) => {
  const [balance, price, txs] = await Promise.all([
    getNativeBalance(address, config),
    getPrice(config.priceId),
    getTransactions(address, config),
  ]);

  const nativeAmount = safeNumber(balance);
  const nativeUsd = nativeAmount * price;
  const flow = getFlow(txs, config.nativeSymbol, price);
  const portfolio = await getPortfolio(address, config);
  const portfolioUsd = getPortfolioValue(portfolio);
  const usd = Math.max(nativeUsd, portfolioUsd);
  const risk = getRisk(txs, portfolio, config.nativeSymbol, price, flow);
  const walletAge = await getWalletAge(address, config, txs);
  const tags = getTags(usd, txs, flow, walletAge);
  const pnl = await getPnl(txs, balance, config, price);

  return {
    address,
    chain: config.label,
    balance,
    usd,
    walletAge,
    badge: getBadge(usd, nativeAmount, config.nativeSymbol),
    inflow: flow.inflow,
    outflow: flow.outflow,
    netFlow: flow.netFlow,
    riskScore: risk.riskScore,
    riskLevel: risk.riskLevel,
    tags,
    pnl,
    portfolio,
    txs: txs.slice(0, 50),
  };
};

module.exports = {
  fallbackResponse,
  getWalletAnalytics,
  getTransactions,
};
