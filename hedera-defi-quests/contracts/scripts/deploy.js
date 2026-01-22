const hre = require("hardhat");

async function main() {
  console.log("Deploying Hedera DeFi Quest Contracts...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  // Deploy QuestToken
  console.log("\n1. Deploying QuestToken (HQT)...");
  const QuestToken = await ethers.getContractFactory("QuestToken");
  const questToken = await QuestToken.deploy();
  await questToken.waitForDeployment();
  const tokenAddress = await questToken.getAddress();
  console.log(`✓ QuestToken deployed to: ${tokenAddress}`);

  // Deploy QuestNFT
  console.log("\n2. Deploying QuestNFT...");
  const QuestNFT = await ethers.getContractFactory("QuestNFT");
  const questNFT = await QuestNFT.deploy();
  await questNFT.waitForDeployment();
  const nftAddress = await questNFT.getAddress();
  console.log(`✓ QuestNFT deployed to: ${nftAddress}`);

  // Deploy QuestManager
  console.log("\n3. Deploying QuestManager...");
  const QuestManager = await ethers.getContractFactory("QuestManager");
  const questManager = await QuestManager.deploy(tokenAddress, nftAddress);
  await questManager.waitForDeployment();
  const managerAddress = await questManager.getAddress();
  console.log(`✓ QuestManager deployed to: ${managerAddress}`);

  // Setup permissions
  console.log("\n4. Setting up permissions...");
  
  // Authorize QuestManager to mint tokens
  let tx = await questToken.authorizeMinter(managerAddress);
  await tx.wait();
  console.log(`✓ QuestManager authorized as token minter`);

  // Authorize QuestManager to issue NFT badges
  tx = await questNFT.authorizeIssuer(managerAddress);
  await tx.wait();
  console.log(`✓ QuestManager authorized as NFT issuer`);

  // Output deployment info
  console.log("\n" + "=".repeat(50));
  console.log("DEPLOYMENT COMPLETE");
  console.log("=".repeat(50));
  console.log(`
Contract Addresses:
  QuestToken: ${tokenAddress}
  QuestNFT: ${nftAddress}
  QuestManager: ${managerAddress}

Update your .env file with these addresses.
  `);

  // Save deployment info to file
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      QuestToken: tokenAddress,
      QuestNFT: nftAddress,
      QuestManager: managerAddress,
    },
  };

  fs.writeFileSync(
    "deployments.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment info saved to deployments.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
