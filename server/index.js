require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const walletRoutes = require("./routes/wallet");

app.use(cors());
app.use(express.json());

app.use("/wallet", walletRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});