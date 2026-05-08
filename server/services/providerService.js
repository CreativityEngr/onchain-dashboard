const { ethers } = require("ethers");

const getProvider = (config) => new ethers.JsonRpcProvider(config.rpc);

const getNativeBalance = async (address, config) => {
  try {
    const balance = await getProvider(config).getBalance(address);
    return ethers.formatEther(balance);
  } catch {
    return "0";
  }
};

module.exports = {
  getNativeBalance,
  getProvider,
};
