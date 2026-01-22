// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title QuestNFT
 * @dev Non-fungible tokens representing achievement badges for completed quests
 */
contract QuestNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    constructor() ERC721("Quest Badge", "QBADGE") Ownable(msg.sender) {}

    // Token ID counter
    Counters.Counter private _tokenIdCounter;

    // Authorized issuers (QuestManager contract)
    mapping(address => bool) public authorizedIssuers;

    // Quest metadata
    struct QuestBadge {
        uint256 questId;
        string questName;
        string tier;
        uint256 issuedAt;
        string uri;
    }

    // Token ID to quest badge metadata
    mapping(uint256 => QuestBadge) public badges;

    // User to array of owned badge token IDs
    mapping(address => uint256[]) public userBadges;

    // Track if user completed quest (prevent duplicate claims)
    mapping(address => mapping(uint256 => bool)) public questCompleted;

    // Events
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    event BadgeMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 indexed questId,
        string tier
    );

  

    /**
     * @dev Authorize an address to issue badges
     */
    function authorizeIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    /**
     * @dev Revoke issuer privileges
     */
    function revokeIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    /**
     * @dev Mint a quest achievement badge
     */
    function mintBadge(
        address to,
        uint256 questId,
        string memory questName,
        string memory tier,
        string memory uri
    ) external returns (uint256) {
        require(authorizedIssuers[msg.sender], "Not authorized to issue badges");
        require(to != address(0), "Invalid recipient");
        require(!questCompleted[to][questId], "Quest already completed by user");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Create badge metadata
        badges[tokenId] = QuestBadge({
            questId: questId,
            questName: questName,
            tier: tier,
            issuedAt: block.timestamp,
            uri: uri
        });

        // Mark quest as completed
        questCompleted[to][questId] = true;

        // Track user badges
        userBadges[to].push(tokenId);

        // Mint NFT
        _safeMint(to, tokenId);

        emit BadgeMinted(tokenId, to, questId, tier);
        return tokenId;
    }

    /**
     * @dev Get all badges owned by a user
     */
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }

    /**
     * @dev Get badge details
     */
    function getBadgeDetails(uint256 tokenId) external view returns (QuestBadge memory) {
        require(_exists(tokenId), "Token does not exist");
        return badges[tokenId];
    }

    /**
     * @dev Check if user has completed a quest
     */
    function hasCompletedQuest(address user, uint256 questId) external view returns (bool) {
        return questCompleted[user][questId];
    }

    /**
     * @dev Override _exists to check if token exists (for older Solidity versions)
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return ownerOf(tokenId) != address(0);
    }
}
