// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title QuestToken (HQT)
 * @dev ERC20 token distributed as rewards for completing DeFi quests
 */
contract QuestToken is ERC20, Ownable, Pausable {
    contract QuestToken is ERC20, Ownable(msg.sender), Pausable {
    // ... rest of the contract
}
    // Mint cap to prevent hyperinflation
    uint256 private _mintCap = 1_000_000_000 * 10 ** 18; // 1 billion tokens
    uint256 private _totalMinted;

    // Authorized minters (QuestManager contract)
    mapping(address => bool) public authorizedMinters;

    // Event tracking
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount);

    constructor() ERC20("Quest Token", "HQT") {
        // Initial mint to contract owner for liquidity
        uint256 initialMint = 10_000_000 * 10 ** 18; // 10 million tokens
        _mint(msg.sender, initialMint);
        _totalMinted = initialMint;
    }

    /**
     * @dev Authorize an address to mint tokens (only owner)
     */
    function authorizeMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }

    /**
     * @dev Revoke minting privileges
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }

    /**
     * @dev Mint tokens to user upon quest completion
     */
    function questMint(address to, uint256 amount) external returns (bool) {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        require(to != address(0), "Invalid recipient");
        require(_totalMinted + amount <= _mintCap, "Mint cap exceeded");

        _totalMinted += amount;
        _mint(to, amount);
        emit TokensMinted(to, amount);
        return true;
    }

    /**
     * @dev Pause token transfers in case of emergency
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Resume token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Override transfer to check pause status
     */
    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }

    /**
     * @dev Get remaining mintable tokens
     */
    function remainingMintable() external view returns (uint256) {
        return _mintCap - _totalMinted;
    }
}
