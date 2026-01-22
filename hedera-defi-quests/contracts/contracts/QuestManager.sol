// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./QuestToken.sol";
import "./QuestNFT.sol";

/**
 * @title QuestManager
 * @dev Main contract managing quest creation, tracking, and reward distribution
 */
contract QuestManager is Ownable, Pausable, ReentrancyGuard {
    // References to token and NFT contracts
    QuestToken public rewardToken;
    QuestNFT public nftBadges;

    // Quest structure
    struct Quest {
        uint256 id;
        string name;
        string description;
        uint256 rewardAmount;
        string[] rewardTiers;
        uint256 maxCompletions;
        uint256 completions;
        bool active;
        uint256 createdAt;
    }

    // Verification requirements
    struct VerificationRequirement {
        string verificationMethod; // "staking", "liquidity", "swap", "governance"
        address targetProtocol;
        uint256 minimumAmount;
        uint256 minimumDuration;
    }

    // Quest data storage
    mapping(uint256 => Quest) public quests;
    mapping(uint256 => VerificationRequirement) public requirements;
    
    // User progress tracking
    mapping(address => mapping(uint256 => bool)) public userClaimedReward;
    mapping(address => uint256[]) public userCompletedQuests;
    mapping(address => uint256) public userTotalRewards;

    // Quest counter
    uint256 public questCounter;

    // Oracle address for verification (can be updated)
    address public oracleAddress;

    // Rate limiting for claims
    mapping(address => uint256) public lastClaimTime;
    uint256 public constant CLAIM_COOLDOWN = 1 hours;

    // Events
    event QuestCreated(
        uint256 indexed questId,
        string name,
        uint256 rewardAmount
    );
    event QuestClaimed(
        address indexed user,
        uint256 indexed questId,
        uint256 rewardAmount,
        string tier
    );
    event VerificationUpdated(uint256 indexed questId, string method);
    event OracleUpdated(address newOracle);

    constructor(address _rewardToken, address _nftBadges) {
        rewardToken = QuestToken(_rewardToken);
        nftBadges = QuestNFT(_nftBadges);
        oracleAddress = msg.sender;
    }

    /**
     * @dev Create a new quest
     */
    function createQuest(
        string memory name,
        string memory description,
        uint256 rewardAmount,
        string[] memory rewardTiers,
        uint256 maxCompletions
    ) external onlyOwner returns (uint256) {
        require(rewardAmount > 0, "Reward amount must be greater than 0");
        require(rewardTiers.length > 0, "Must have at least one reward tier");

        uint256 questId = questCounter++;

        quests[questId] = Quest({
            id: questId,
            name: name,
            description: description,
            rewardAmount: rewardAmount,
            rewardTiers: rewardTiers,
            maxCompletions: maxCompletions,
            completions: 0,
            active: true,
            createdAt: block.timestamp
        });

        emit QuestCreated(questId, name, rewardAmount);
        return questId;
    }

    /**
     * @dev Set verification requirements for a quest
     */
    function setVerificationRequirement(
        uint256 questId,
        string memory method,
        address targetProtocol,
        uint256 minimumAmount,
        uint256 minimumDuration
    ) external onlyOwner {
        require(quests[questId].createdAt > 0, "Quest does not exist");

        requirements[questId] = VerificationRequirement({
            verificationMethod: method,
            targetProtocol: targetProtocol,
            minimumAmount: minimumAmount,
            minimumDuration: minimumDuration
        });

        emit VerificationUpdated(questId, method);
    }

    /**
     * @dev Claim quest reward
     */
    function claimQuestReward(
        uint256 questId,
        string memory selectedTier
    ) external nonReentrant whenNotPaused returns (bool) {
        require(quests[questId].createdAt > 0, "Quest does not exist");
        require(quests[questId].active, "Quest is not active");
        require(
            quests[questId].completions < quests[questId].maxCompletions,
            "Quest max completions reached"
        );
        require(!userClaimedReward[msg.sender][questId], "Already claimed this quest");
        require(
            block.timestamp >= lastClaimTime[msg.sender] + CLAIM_COOLDOWN,
            "Claim cooldown not met"
        );

        // Verify quest completion (would be done by oracle in production)
        _verifyQuestCompletion(questId, msg.sender);

        Quest storage quest = quests[questId];
        
        // Distribute token rewards
        rewardToken.questMint(msg.sender, quest.rewardAmount);

        // Mint NFT badge
        nftBadges.mintBadge(
            msg.sender,
            questId,
            quest.name,
            selectedTier,
            "" // URI would be set based on tier
        );

        // Update tracking
        userClaimedReward[msg.sender][questId] = true;
        userCompletedQuests[msg.sender].push(questId);
        userTotalRewards[msg.sender] += quest.rewardAmount;
        quest.completions++;
        lastClaimTime[msg.sender] = block.timestamp;

        emit QuestClaimed(msg.sender, questId, quest.rewardAmount, selectedTier);
        return true;
    }

    /**
     * @dev Verify quest completion
     */
    function _verifyQuestCompletion(uint256 questId, address user) internal view {
        VerificationRequirement memory req = requirements[questId];
        
        // In production, this would call an oracle to verify on-chain activity
        // For MVP, we'll allow claim but in production:
        // - Verify staking position exists
        // - Verify liquidity provision
        // - Verify swap executed
        // - Verify governance participation
        
        // Placeholder for oracle verification
        require(user != address(0), "Invalid user");
    }

    /**
     * @dev Get user's completed quests
     */
    function getUserCompletedQuests(address user) external view returns (uint256[] memory) {
        return userCompletedQuests[user];
    }

    /**
     * @dev Get user's total earned rewards
     */
    function getUserTotalRewards(address user) external view returns (uint256) {
        return userTotalRewards[user];
    }

    /**
     * @dev Get quest details
     */
    function getQuestDetails(uint256 questId) external view returns (Quest memory) {
        return quests[questId];
    }

    /**
     * @dev Update oracle address
     */
    function setOracleAddress(address newOracle) external onlyOwner {
        require(newOracle != address(0), "Invalid oracle address");
        oracleAddress = newOracle;
        emit OracleUpdated(newOracle);
    }

    /**
     * @dev Deactivate a quest
     */
    function deactivateQuest(uint256 questId) external onlyOwner {
        require(quests[questId].createdAt > 0, "Quest does not exist");
        quests[questId].active = false;
    }

    /**
     * @dev Pause all quest claims
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Resume quest claims
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
