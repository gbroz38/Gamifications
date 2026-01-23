# Hedera DeFi Gamification dApp - Setup Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Deployment](#deployment)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Smart Contracts](#smart-contracts)
9. [Troubleshooting](#troubleshooting)

## Project Overview

Hedera Quest is a decentralized application (dApp) that gamifies DeFi activities on the Hedera network. Users can complete quests related to staking, liquidity provision, swaps, and governance participation. Upon completion, they earn ERC20-like reward tokens (HQT) and unique NFT badges representing their achievements.

### Key Features
- **Quest System**: Predefined DeFi quests with multiple reward tiers
- **On-Chain Verification**: Automatic verification of completed quests
- **Reward Tokens**: HQT tokens distributed as quest rewards
- **NFT Badges**: Non-transferable achievement NFTs
- **User Dashboard**: Real-time progress tracking
- **Leaderboard**: Competitive rankings with rewards
- **Wallet Integration**: HashPack and other Hedera wallet support

## Prerequisites

### Software Requirements
- Node.js v16 or higher
- npm v8 or higher
- Git

### Hedera Accounts
- Hedera testnet account (get free HBAR at [Hedera Faucet](https://testnet.hedera.com/faucet))
- Hedera mainnet account (for production deployment)

### Wallets
- HashPack wallet extension ([Download](https://www.hashpack.app/))
- Other compatible Hedera wallets

## Installation

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/hedera-defi-quests.git
cd hedera-defi-quests

# Install root dependencies
npm install

# Install all sub-project dependencies
npm run install:all
```

### 2. Directory Structure

```
hedera-defi-quests/
├── contracts/          # Smart contracts (Solidity)
│   ├── contracts/
│   │   ├── QuestToken.sol      # Reward token
│   │   ├── QuestNFT.sol        # Achievement badges
│   │   └── QuestManager.sol    # Quest orchestration
│   ├── scripts/
│   │   └── deploy.js           # Deployment script
│   └── package.json
│
├── backend/            # Node.js/Express API
│   ├── routes/
│   │   ├── quests.js           # Quest endpoints
│   │   ├── users.js            # User progress endpoints
│   │   └── verification.js     # Quest verification
│   ├── server.js               # Main server file
│   └── package.json
│
├── frontend/           # React web application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
├── docs/              # Documentation
└── .env.example       # Environment template

```

## Configuration

### 1. Create Environment File

```bash
cp .env.example .env
```

### 2. Configure Hedera Network

Edit `.env` with your Hedera credentials:

```env
# Hedera Network Configuration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=xxxxx

# Backend Configuration
BACKEND_PORT=5000
NODE_ENV=development

# Frontend Configuration
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_HEDERA_NETWORK=testnet
```

### 3. Hedera SDK Configuration

For contract deployment, configure `hardhat.config.js`:

```javascript
networks: {
  "hedera-testnet": {
    url: "https://testnet.hashio.io/api",
    accounts: [process.env.HEDERA_PRIVATE_KEY],
    chainId: 296,
  },
}
```

## Deployment

### 1. Deploy Smart Contracts

```bash
cd contracts

# Compile contracts
npm run compile

# Deploy to Hedera testnet
npm run deploy

# Output will show:
# ✓ QuestToken deployed to: 0.0.xxxxx
# ✓ QuestNFT deployed to: 0.0.xxxxx
# ✓ QuestManager deployed to: 0.0.xxxxx
```

### 2. Update Contract Addresses

After deployment, update `.env` with the contract addresses:

```env
QUEST_TOKEN_CONTRACT=0.0.xxxxx
QUEST_NFT_CONTRACT=0.0.xxxxx
QUEST_MANAGER_CONTRACT=0.0.xxxxx
```

### 3. Initialize Quests

Create quests via the smart contract:

```solidity
// Example: Create a staking quest
questManager.createQuest(
  "Stake Your Tokens",
  "Stake 100 tokens for 7 days",
  500,  // 500 HQT reward
  ["Bronze", "Silver", "Gold"],
  1000  // max 1000 completions
);

// Set verification requirements
questManager.setVerificationRequirement(
  0,  // quest ID
  "staking",
  0x0000000000000000000000000000000000000000,  // target protocol
  100,  // minimum amount
  604800  // 7 days minimum
);
```

## Running the Application

### Option 1: Run Everything

```bash
npm run dev

# Runs:
# - Backend API on http://localhost:5000
# - Frontend on http://localhost:3000
```

### Option 2: Run Individually

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm start
```

## API Documentation

### Quest Endpoints

#### GET /api/quests
List all quests

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Stake Your Tokens",
      "description": "Stake minimum amount...",
      "rewardAmount": 500,
      "rewardTiers": ["Bronze", "Silver", "Gold"],
      "maxCompletions": 1000,
      "completions": 342,
      "active": true
    }
  ],
  "count": 4
}
```

#### GET /api/quests/:id
Get specific quest

**Parameters:**
- `id` (number): Quest ID

**Response:**
```json
{
  "success": true,
  "data": { /* quest object */ }
}
```

#### GET /api/quests/category/:category
Filter quests by category

**Parameters:**
- `category` (string): staking, liquidity, swap, governance

**Response:**
```json
{
  "success": true,
  "data": [ /* filtered quests */ ],
  "count": 2
}
```

### User Endpoints

#### GET /api/users/:address/progress
Get user quest progress

**Parameters:**
- `address` (string): Hedera account address (0.0.xxxxx)

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0.0.12345",
    "completedQuests": [1, 2, 3],
    "inProgressQuests": [4],
    "totalRewards": 2750,
    "nftBadges": 3,
    "level": 3
  }
}
```

#### GET /api/users/:address/rewards
Get user rewards

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0.0.12345",
    "totalTokens": 2750,
    "totalNFTs": 3,
    "rewardHistory": [
      {
        "questId": 1,
        "amount": 500,
        "date": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### GET /api/users/:address/nfts
Get user NFT badges

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tokenId": 1,
      "questId": 1,
      "questName": "Stake Your Tokens",
      "tier": "Gold",
      "issuedAt": "2024-01-20T00:00:00Z"
    }
  ],
  "count": 3
}
```

### Verification Endpoints

#### POST /api/verify/staking
Verify staking activity

**Body:**
```json
{
  "userAddress": "0.0.12345",
  "amount": 100,
  "transactionHash": "0x1234..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "stakingDuration": 604800,
    "verificationTime": "2024-01-20T00:00:00Z"
  }
}
```

#### POST /api/verify/liquidity
Verify liquidity provision

**Body:**
```json
{
  "userAddress": "0.0.12345",
  "liquidityAmount": 1000,
  "pair": "HBAR/USDC",
  "transactionHash": "0x1234..."
}
```

#### POST /api/verify/swap
Verify swap activity

**Body:**
```json
{
  "userAddress": "0.0.12345",
  "swapAmount": 500,
  "inputToken": "HBAR",
  "outputToken": "USDC",
  "transactionHash": "0x1234..."
}
```

#### POST /api/verify/governance
Verify governance participation

**Body:**
```json
{
  "userAddress": "0.0.12345",
  "proposalId": 1,
  "voteChoice": "yes",
  "transactionHash": "0x1234..."
}
```

## Smart Contracts

### QuestToken (HQT)

**Purpose**: ERC20-compatible reward token

**Key Functions**:
- `authorizeMinter(address)`: Authorize quest manager to mint
- `questMint(to, amount)`: Mint tokens as rewards
- `pause()`: Emergency pause transfers
- `remainingMintable()`: Get remaining mintable tokens

**Deployment**:
```solidity
// 1 billion token supply cap
// Initial 10 million minted to deployer
// Only authorized addresses can mint
```

### QuestNFT

**Purpose**: Non-fungible achievement badges

**Key Functions**:
- `authorizeIssuer(address)`: Authorize badge issuer
- `mintBadge(to, questId, questName, tier, uri)`: Mint achievement badge
- `getUserBadges(address)`: Get user's badges
- `hasCompletedQuest(user, questId)`: Check quest completion

**Features**:
- Non-transferable achievement NFTs
- Quest completion tracking
- Tier-based reward variants

### QuestManager

**Purpose**: Orchestrates quest creation, tracking, and rewards

**Key Functions**:
- `createQuest(name, description, reward, tiers, maxCompletions)`: Create quest
- `setVerificationRequirement(questId, method, protocol, amount, duration)`: Configure verification
- `claimQuestReward(questId, tier)`: Claim quest reward
- `getUserCompletedQuests(user)`: Get user's completed quests
- `getQuestDetails(questId)`: Get quest information

**Features**:
- Rate limiting on claims (1 hour cooldown)
- Reentrancy protection
- Pausable for emergency situations
- Oracle-based verification support

## Frontend Features

### Pages

1. **Dashboard**: Browse and filter quests
2. **Quest Detail**: View requirements and claim rewards
3. **User Profile**: View stats, badges, and earned rewards
4. **Leaderboard**: Competitive rankings

### Components

- **Navigation**: Wallet connection and navigation
- **QuestCard**: Quest display with progress
- **StatCard**: Display user statistics

## Troubleshooting

### Issue: "Cannot find module" errors

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run install:all
```

### Issue: Wallet connection fails

```
Solution:
1. Ensure HashPack is installed
2. Check Hedera network matches app config
3. Verify account has HBAR balance
4. Clear browser cache and try again
```

### Issue: Smart contract deployment fails

```bash
# Check:
1. HEDERA_PRIVATE_KEY is valid
2. Account has sufficient HBAR
3. Network URL is correct
4. Gas limit is sufficient

# Solution:
npm run contracts:deploy
```

### Issue: Quest claim transaction fails

```
Check:
1. Quest requirements are met
2. User hasn't already claimed
3. Quest is active
4. Smart contract has permission to mint
```

## Security Best Practices

1. **Never commit `.env` files**: Use `.env.example` template
2. **Validate all inputs**: Server-side validation on API
3. **Use HTTPS in production**: For secure communication
4. **Regular audits**: Get smart contracts audited
5. **Monitor transactions**: Set up alerts for suspicious activity
6. **Rate limiting**: Implemented on API endpoints

## Performance Optimization

- Backend caching for quest data
- Frontend lazy loading for images
- Optimized React rendering
- Contract gas optimization
- Database indexing on common queries

## Next Steps

1. [Deploy to mainnet](./MAINNET_DEPLOYMENT.md)
2. [Create additional quests](./QUEST_CREATION.md)
3. [Integrate with DeFi protocols](./PROTOCOL_INTEGRATION.md)
4. [Set up oracle for verification](./ORACLE_SETUP.md)

## Support

For issues and feature requests:
- GitHub Issues: [Create an issue](https://github.com/yourusername/hedera-defi-quests/issues)
- Discord: [Join community](https://discord.gg/hedera)
- Email: support@example.com

## License

MIT License - See LICENSE file for details
