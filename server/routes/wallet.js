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

    res.json({
      address,
      balance: ethBalance
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid address" });
  }
});

module.exports = router;