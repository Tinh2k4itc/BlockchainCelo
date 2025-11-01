import { network } from "hardhat";

/**
 * Script để deploy DiplomaVerification contract
 * 
 * Usage:
 * - Local: npx hardhat run scripts/deploy-diploma.ts
 * - Sepolia: npx hardhat run scripts/deploy-diploma.ts --network sepolia
 */
async function main() {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  
  console.log("Deploying DiplomaVerification contract...");
  console.log("Deployer address:", deployer.account.address);
  
  const diplomaVerification = await viem.deployContract("DiplomaVerification");
  
  console.log("\n✅ Contract deployed successfully!");
  console.log("Contract address:", diplomaVerification.address);
  console.log("Admin address:", deployer.account.address);
  
  // Verify admin
  const admin = await diplomaVerification.read.admin();
  console.log("Contract admin:", admin);
  
  console.log("\n📋 Next steps:");
  console.log("1. Save this contract address for future interactions");
  console.log("2. Use scripts/add-diploma.ts to add diplomas");
  console.log("3. Use scripts/verify-diploma.ts to verify diplomas");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

