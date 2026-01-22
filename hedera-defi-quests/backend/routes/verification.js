// Verification routes - handles quest completion verification
const express = require("express");
const { validationResult } = require("express-validator");
const router = express.Router();

/**
 * POST /api/verify/staking - Verify staking activity
 * Body: { userAddress: string, amount: number, transactionHash: string }
 */
router.post("/staking", (req, res) => {
  try {
    const { userAddress, amount, transactionHash } = req.body;

    // Validate required fields
    if (!userAddress || !amount || !transactionHash) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userAddress, amount, transactionHash",
      });
    }

    // Validate Hedera address format
    if (!userAddress.match(/^0\.0\.\d+$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Hedera account address",
      });
    }

    // Validate amount is positive number
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be a positive number",
      });
    }

    // Mock verification - in production, query on-chain data
    const verified = {
      success: true,
      userAddress,
      amount,
      transactionHash,
      verified: true,
      verificationTime: new Date(),
      protocol: "Hedera DeFi Protocol",
      stakingDuration: 604800, // 7 days
    };

    res.json({
      success: true,
      data: verified,
      message: "Staking activity verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/verify/liquidity - Verify liquidity provision
 * Body: { userAddress: string, liquidityAmount: number, pair: string, transactionHash: string }
 */
router.post("/liquidity", (req, res) => {
  try {
    const { userAddress, liquidityAmount, pair, transactionHash } = req.body;

    // Validate required fields
    if (!userAddress || !liquidityAmount || !pair || !transactionHash) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: userAddress, liquidityAmount, pair, transactionHash",
      });
    }

    // Validate Hedera address format
    if (!userAddress.match(/^0\.0\.\d+$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Hedera account address",
      });
    }

    // Mock verification
    const verified = {
      success: true,
      userAddress,
      liquidityAmount,
      pair,
      transactionHash,
      verified: true,
      verificationTime: new Date(),
      lpTokensIssued: liquidityAmount * 0.95,
    };

    res.json({
      success: true,
      data: verified,
      message: "Liquidity provision verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/verify/swap - Verify swap activity
 * Body: { userAddress: string, swapAmount: number, inputToken: string, outputToken: string, transactionHash: string }
 */
router.post("/swap", (req, res) => {
  try {
    const {
      userAddress,
      swapAmount,
      inputToken,
      outputToken,
      transactionHash,
    } = req.body;

    // Validate required fields
    if (
      !userAddress ||
      !swapAmount ||
      !inputToken ||
      !outputToken ||
      !transactionHash
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: userAddress, swapAmount, inputToken, outputToken, transactionHash",
      });
    }

    // Validate Hedera address format
    if (!userAddress.match(/^0\.0\.\d+$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Hedera account address",
      });
    }

    // Mock verification
    const outputAmount = swapAmount * 0.98; // Mock slippage
    const verified = {
      success: true,
      userAddress,
      swapAmount,
      inputToken,
      outputToken,
      outputAmount,
      transactionHash,
      verified: true,
      verificationTime: new Date(),
      swapRoute: [inputToken, "WHBAR", outputToken],
    };

    res.json({
      success: true,
      data: verified,
      message: "Swap activity verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/verify/governance - Verify governance participation
 * Body: { userAddress: string, proposalId: number, voteChoice: string, transactionHash: string }
 */
router.post("/governance", (req, res) => {
  try {
    const { userAddress, proposalId, voteChoice, transactionHash } = req.body;

    // Validate required fields
    if (!userAddress || !proposalId || !voteChoice || !transactionHash) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: userAddress, proposalId, voteChoice, transactionHash",
      });
    }

    // Validate vote choice
    if (!["yes", "no", "abstain"].includes(voteChoice.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: "Vote choice must be 'yes', 'no', or 'abstain'",
      });
    }

    // Validate Hedera address format
    if (!userAddress.match(/^0\.0\.\d+$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Hedera account address",
      });
    }

    // Mock verification
    const verified = {
      success: true,
      userAddress,
      proposalId,
      voteChoice: voteChoice.toLowerCase(),
      transactionHash,
      verified: true,
      verificationTime: new Date(),
      votingPower: 1000,
    };

    res.json({
      success: true,
      data: verified,
      message: "Governance participation verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
