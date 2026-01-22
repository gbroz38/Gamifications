// Backend server main file
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

// Import routes
const questRoutes = require("./routes/quests");
const userRoutes = require("./routes/users");
const verificationRoutes = require("./routes/verification");

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Hedera network setup
const hederaNetwork = process.env.HEDERA_NETWORK || "testnet";
const provider = new ethers.JsonRpcProvider(
  hederaNetwork === "testnet"
    ? "https://testnet.hashio.io/api"
    : "https://mainnet.hashio.io/api"
);

// Store provider in app for use in routes
app.locals.provider = provider;
app.locals.network = hederaNetwork;

// Routes
app.use("/api/quests", questRoutes);
app.use("/api/users", userRoutes);
app.use("/api/verify", verificationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    network: hederaNetwork,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Hedera DeFi Quest Backend Server      ║
║  Running on port ${PORT}                    ║
║  Network: ${hederaNetwork.toUpperCase().padEnd(24)} ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
