// User routes - handles user progress and rewards
const express = require("express");
const router = express.Router();

// Mock user database
const userProgress = new Map();
const userRewards = new Map();

/**
 * GET /api/users/:address/progress - Get user's quest progress
 */
router.get("/:address/progress", (req, res) => {
  try {
    const { address } = req.params;

    // Validate Hedera address format
    if (!address.match(/^0\.0\.\d+$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Hedera account address",
      });
    }

    // Get user progress (mock data if not exists)
    const progress = userProgress.get(address) || {
      address,
      completedQuests: [],
      inProgressQuests: [],
      totalRewards: 0,
      nftBadges: 0,
      level: 1,
      experience: 0,
    };

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/users/:address/rewards - Get user's earned rewards
 */
router.get("/:address/rewards", (req, res) => {
  try {
    const { address } = req.params;

    // Validate Hedera address format
    if (!address.match(/^0\.0\.\d+$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Hedera account address",
      });
    }

    // Get user rewards
    const rewards = userRewards.get(address) || {
      address,
      totalTokens: 0,
      totalNFTs: 0,
      rewardHistory: [],
    };

    res.json({
      success: true,
      data: rewards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/users/:address/nfts - Get user's NFT badges
 */
router.get("/:address/nfts", (req, res) => {
  try {
    const { address } = req.params;

    // Validate Hedera address format
    if (!address.match(/^0\.0\.\d+$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Hedera account address",
      });
    }

    // Mock NFT badges
    const nfts = [
      {
        tokenId: 1,
        questId: 1,
        questName: "Stake Your Tokens",
        tier: "Gold",
        issuedAt: new Date("2024-01-20"),
        imageUrl: "https://api.example.com/badges/1",
      },
    ];

    res.json({
      success: true,
      data: nfts,
      count: nfts.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/users/:address/stats - Get user statistics
 */
router.get("/:address/stats", (req, res) => {
  try {
    const { address } = req.params;

    // Validate Hedera address format
    if (!address.match(/^0\.0\.\d+$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Hedera account address",
      });
    }

    const stats = {
      address,
      questsCompleted: 5,
      questsInProgress: 2,
      totalRewardsEarned: 2750,
      nftBadgesEarned: 3,
      leaderboardRank: 142,
      joinDate: new Date("2024-01-01"),
      lastActiveQuest: new Date(),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
