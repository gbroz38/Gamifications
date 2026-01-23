# Quest Creation Guide

## Overview
This guide explains how to create new quests in the Hedera DeFi Gamification system.

## Quest Types

### 1. Staking Quest
Users stake tokens in a DeFi protocol for a minimum duration.

```solidity
questManager.createQuest(
  "Stake Your Tokens",
  "Stake 100+ tokens for 7 days in the DeFi protocol",
  500,  // 500 HQT reward
  ["Bronze", "Silver", "Gold"],
  1000  // max 1000 participants
);

// Set requirements
questManager.setVerificationRequirement(
  0,  // quest ID
  "staking",
  0xProtocolAddress,
  100,  // minimum 100 tokens
  604800  // 7 days in seconds
);
```

### 2. Liquidity Quest
Users provide liquidity to trading pairs.

```solidity
questManager.createQuest(
  "Provide Liquidity",
  "Provide liquidity to HBAR/USDC pair",
  750,  // 750 HQT reward
  ["Bronze", "Silver", "Gold"],
  500
);

questManager.setVerificationRequirement(
  1,
  "liquidity",
  0xUniswapV3Address,
  1000,  // minimum 1000 liquidity value
  86400  // 1 day
);
```

### 3. Swap Quest
Users execute complex swap routes.

```solidity
questManager.createQuest(
  "Multi-Swap Challenge",
  "Execute a swap involving 3+ different assets",
  300,  // 300 HQT reward
  ["Bronze", "Silver"],
  2000
);

questManager.setVerificationRequirement(
  2,
  "swap",
  0xSwapRouterAddress,
  0,  // no minimum amount
  0   // no duration requirement
);
```

### 4. Governance Quest
Users participate in governance voting.

```solidity
questManager.createQuest(
  "Participate in Governance",
  "Vote on at least one governance proposal",
  200,  // 200 HQT reward
  ["Bronze"],
  5000
);

questManager.setVerificationRequirement(
  3,
  "governance",
  0xGovernanceAddress,
  0,
  0
);
```

## Reward Tiers

Reward tiers represent achievement levels:

- **Bronze**: Basic completion
  - Difficulty: Low
  - Reward modifier: 1x
  - Sample requirement: Stake 100 tokens for 7 days

- **Silver**: Intermediate achievement
  - Difficulty: Medium
  - Reward modifier: 1.5x
  - Sample requirement: Stake 500 tokens for 14 days

- **Gold**: Advanced achievement
  - Difficulty: High
  - Reward modifier: 2x
  - Sample requirement: Stake 1000+ tokens for 30 days

- **Platinum**: Expert achievement (optional)
  - Difficulty: Extreme
  - Reward modifier: 3x
  - Sample requirement: Complete additional tasks

## Quest Configuration

### Required Parameters

1. **Name** (string)
   - Quest title (max 100 characters)
   - Example: "Stake Your Tokens"

2. **Description** (string)
   - Detailed explanation (max 500 characters)
   - Include requirements and expectations

3. **Reward Amount** (uint256)
   - Base HQT reward in wei
   - Example: 500 * 10^18 for 500 HQT

4. **Reward Tiers** (string[])
   - Array of tier names
   - Example: ["Bronze", "Silver", "Gold"]

5. **Max Completions** (uint256)
   - Maximum participants
   - Example: 1000

### Optional Parameters

- **Active Status**: Enable/disable quest
- **Duration**: Time-limited quests
- **Minimum Participant Level**: Only for experienced users
- **Daily Limit**: Users per day cap

## Verification Requirements

```solidity
struct VerificationRequirement {
  string verificationMethod;    // "staking", "liquidity", "swap", "governance"
  address targetProtocol;       // DeFi protocol address
  uint256 minimumAmount;        // Minimum tokens/liquidity
  uint256 minimumDuration;      // Minimum duration in seconds
}
```

### Verification Methods

1. **Staking**: On-chain staking position verification
2. **Liquidity**: UniswapV3/Sushiswap LP token balance
3. **Swap**: DEX transaction history
4. **Governance**: DAO proposal voting records

## Example: Creating a Complete Quest Series

```solidity
// Quest 1: Introduction to Staking
questManager.createQuest(
  "Staking 101",
  "Complete your first staking transaction",
  250,
  ["Bronze"],
  5000
);
questManager.setVerificationRequirement(0, "staking", protocol, 50, 86400);

// Quest 2: Liquidity Provider
questManager.createQuest(
  "Become a Liquidity Provider",
  "Provide liquidity to earn swap fees",
  500,
  ["Bronze", "Silver"],
  2000
);
questManager.setVerificationRequirement(1, "liquidity", protocol, 500, 604800);

// Quest 3: Advanced Swapper
questManager.createQuest(
  "Master Multi-Hop Swaps",
  "Execute complex swap routes",
  400,
  ["Silver", "Gold"],
  1000
);
questManager.setVerificationRequirement(2, "swap", protocol, 0, 0);

// Quest 4: Governance Master
questManager.createQuest(
  "Governance Expert",
  "Participate in protocol governance",
  300,
  ["Bronze", "Silver", "Gold"],
  3000
);
questManager.setVerificationRequirement(3, "governance", governance, 0, 0);
```

## Best Practices

### Design Considerations

1. **Progressive Difficulty**
   - Start with simple quests
   - Gradually increase complexity
   - Create natural progression paths

2. **Balanced Rewards**
   - More difficult quests = higher rewards
   - Consider risk vs. reward
   - Prevent reward farming

3. **Realistic Requirements**
   - Set achievable goals
   - Consider user DeFi experience
   - Test before mainnet launch

4. **Clear Descriptions**
   - Explicit requirements
   - Step-by-step instructions
   - Link to helpful resources

### Quest Timing

```javascript
// Recurring daily quest
- Daily reset at UTC 0:00
- Users can complete once per day
- Special weekend bonuses

// Seasonal quests
- Limited availability (e.g., 2 weeks)
- Higher rewards for exclusivity
- Theme-based activities

// One-time quests
- Permanent availability
- Can only complete once per user
- For special achievements
```

## Monitoring Quest Performance

### Key Metrics

1. **Completion Rate**
   ```
   completion_rate = total_completions / max_completions * 100
   ```
   - Target: 30-50% for balanced difficulty
   - < 10%: Too difficult, consider adjustment
   - > 80%: Too easy, increase requirements

2. **Average Time to Completion**
   - Track how long users take
   - Ensure reasonable duration
   - Identify confusing steps

3. **Reward Distribution**
   - Monitor token distribution
   - Prevent economic imbalance
   - Adjust mint rates if needed

4. **User Engagement**
   - Track quest attempts vs. completions
   - Identify abandoned quests
   - Gather user feedback

## Updating Existing Quests

```solidity
// Modify quest status
questManager.deactivateQuest(questId);
questManager.activateQuest(questId);

// Update verification requirements
questManager.setVerificationRequirement(
  questId,
  newMethod,
  newProtocol,
  newMinAmount,
  newMinDuration
);

// Note: Cannot directly modify rewards or tiers
// Must create new quest for significant changes
```

## API Endpoint Examples

### Frontend Quest Creation (Admin)

```javascript
// POST /api/admin/quests
const newQuest = {
  name: "Stake Your Tokens",
  description: "Stake 100+ tokens for 7 days",
  rewardAmount: 500,
  rewardTiers: ["Bronze", "Silver", "Gold"],
  maxCompletions: 1000,
  requirements: {
    method: "staking",
    protocol: "0x...",
    minAmount: 100,
    minDuration: 604800
  }
};
```

## Gamification Strategy

### Quest Chains
Create related quests that build on each other:
- Beginner Quest → Intermediate Quest → Advanced Quest
- Rewards increase with progression
- Badges show achievement chain

### Special Events
- Holiday-themed quests
- Limited-time challenges
- Community milestones

### Leaderboard Integration
- Top performers earn bonus rewards
- Weekly/monthly cycles
- Seasonal competitions

## Security Considerations

1. **Prevent Reward Farming**
   - Implement cooldown periods
   - Set maximum daily claims
   - Verify genuine activity

2. **Validate Requirements**
   - Use oracle for off-chain verification
   - Multi-step verification process
   - Suspicious activity detection

3. **Smart Contract Audits**
   - Audit new quest parameters
   - Test on testnet first
   - Gradual rollout on mainnet

## Example: Complete Quest Setup

[See QUEST_EXAMPLES.md for additional detailed quest templates]
