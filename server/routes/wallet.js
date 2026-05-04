const axios = require("axios");

const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
  "https://ethereum.publicnode.com"
);

router.get("/:address", async (req, res) => {
  try {
    const { address } = req.params;

   const balance = await provider.getBalance(address);
const ethBalance = ethers.formatEther(balance);

let txs = [];

const ETHERSCAN_API_KEY = "Q39DIBNY5K2Q98KQS1TD4XKCXWKD18C8PX";

try {
const historyRes = await axios.get(
  `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`
);

  if (Array.isArray(historyRes.data.result)) {
    txs = historyRes.data.result.slice(0, 5);
  }
} catch (err) {
  console.log("tx fetch error:", err.message);
}

// get ETH price (USD)
const priceRes = await axios.get(
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
);

const ethPrice = priceRes.data.ethereum.usd;

// calculate USD value
const usdValue = (parseFloat(ethBalance) * ethPrice).toFixed(2);

res.json({
  address,
  balance: ethBalance,
  usd: usdValue,
  txs
});

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid address" });
  }
});

module.exports = router;