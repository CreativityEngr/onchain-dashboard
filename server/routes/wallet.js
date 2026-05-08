const express = require("express");
const { ethers } = require("ethers");

const { getChain } = require("../config/chains");
const {
  fallbackResponse,
  getWalletAnalytics,
} = require("../services/walletService");

const router = express.Router();

router.get("/:address", async (req, res) => {
  const { address } = req.params;
  const config = getChain(req.query.chain);

  try {
    if (!ethers.isAddress(address)) {
      return res.json(fallbackResponse(address, config));
    }

    return res.json(await getWalletAnalytics(address, config));
  } catch {
    return res.json(fallbackResponse(address, config));
  }
});

module.exports = router;
