# Hedera DeFi Gamification dApp - Quest System

A decentralized application built on Hedera that gamifies DeFi activities by transforming staking, liquidity provision, and other actions into engaging quests. Users earn unique tokens and NFT badges upon quest completion.

## Features

- **Quest System**: Predefined DeFi quests (staking, liquidity provision, swaps)
- **On-Chain Activity Tracking**: Automatic verification of completed quests
- **Reward Tokens**: ERC20-like tokens distributed on quest completion
- **NFT Badges**: Unique NFT achievements for milestone completion
- **Dashboard**: Real-time quest progress and reward tracking
- **Wallet Integration**: Support for HashPack and other Hedera wallets

## Project Structure

```
├── contracts/          # Solidity smart contracts
│   ├── QuestToken.sol     # Reward token contract
│   ├── QuestNFT.sol       # NFT badge contract
│   └── QuestManager.sol   # Main quest tracking contract
├── backend/           # Node.js/Express API
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   └── models/        # Database schemas
├── frontend/          # React application
│   ├── components/    # React components
│   ├── pages/         # Page layouts
│   └── services/      # Frontend API calls
└── docs/             # Documentation
```

## Setup Instructions

### Prerequisites
- Node.js v16+
- Hedera testnet account
- HashPack or other Hedera wallet

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Hedera credentials
   ```

4. Deploy smart contracts:
   ```bash
   npm run contracts:deploy
   ```

5. Start the development environment:
   ```bash
   npm run dev
   ```

## Smart Contracts

### QuestToken (HQT)
- ERC20-compatible token on Hedera
- Minted as rewards for quest completion
- Transferable between users

### QuestNFT
- Non-fungible tokens representing achievements
- Unique metadata per quest tier
- Non-transferable achievement badges

### QuestManager
- Orchestrates quest creation and tracking
- Verifies on-chain activities
- Distributes rewards automatically

## Available Quests

1. **Staking Quest**: Stake minimum amount in DeFi protocol
2. **Liquidity Quest**: Provide liquidity to trading pairs
3. **Swap Quest**: Execute multi-step swaps
4. **Governance Quest**: Participate in protocol governance
5. **Bridge Quest**: Cross-chain asset transfers

## API Endpoints

### Quest Management
- `GET /api/quests` - List all available quests
- `GET /api/quests/:id` - Get quest details
- `POST /api/quests/:id/claim` - Claim quest reward

### User Progress
- `GET /api/users/:address/progress` - Get user quest progress
- `GET /api/users/:address/rewards` - Get earned rewards
- `GET /api/users/:address/nfts` - Get NFT badges

### Verification
- `POST /api/verify/staking` - Verify staking activity
- `POST /api/verify/liquidity` - Verify liquidity provision
- `POST /api/verify/swap` - Verify swap activity

## Development

### Running Tests
```bash
cd contracts
npm test

cd ../backend
npm test

cd ../frontend
npm test
```

### Deploying to Mainnet
Update environment to `HEDERA_NETWORK=mainnet` and run:
```bash
npm run contracts:deploy
```

## Security Considerations

- All smart contracts are audited for security vulnerabilities
- Quest verification uses trusted oracle feeds
- Replay attack protection implemented
- Rate limiting on reward claims

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.
