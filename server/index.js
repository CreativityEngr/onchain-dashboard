const cors = require("cors");

const express = require("express");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const walletRoutes = require("./routes/wallet");
app.use("/wallet", walletRoutes);