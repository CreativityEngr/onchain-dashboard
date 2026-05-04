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
  usd: usdValue
});

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid address" });
  }
});

module.exports = router;