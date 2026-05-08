const CHAIN_CONFIG = {
  avax: {
    chainId: 43114,
    covalentChain: "avalanche-mainnet",
    label: "AVAX",
    nativeSymbol: "AVAX",
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    priceId: "avalanche-2",
  },
  eth: {
    chainId: 1,
    covalentChain: "eth-mainnet",
    label: "ETH",
    nativeSymbol: "ETH",
    rpc: "https://ethereum.publicnode.com",
    priceId: "ethereum",
  },
};

const getChain = (chain) =>
  String(chain).toLowerCase() === "avax" ? CHAIN_CONFIG.avax : CHAIN_CONFIG.eth;

module.exports = {
  CHAIN_CONFIG,
  getChain,
};
