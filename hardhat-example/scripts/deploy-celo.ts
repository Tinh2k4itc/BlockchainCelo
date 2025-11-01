import { network } from "hardhat";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Script deploy lên Celo network
 * 
 * Usage:
 * - Celo Sepolia testnet: npx hardhat run scripts/deploy-celo.ts --network celoSepolia
 * - Alfajores testnet: npx hardhat run scripts/deploy-celo.ts --network alfajores
 * - Celo mainnet: npx hardhat run scripts/deploy-celo.ts --network celo
 * 
 * Setup:
 * 1. Thêm Celo network vào MetaMask (xem CELO_SETUP.md)
 * 2. Lấy CELO testnet tokens từ faucet (cho testnet)
 * 3. Set private key: npx hardhat keystore set CELO_PRIVATE_KEY
 *    Hoặc tạo file .env với CELO_PRIVATE_KEY=0x...
 */
async function main() {
  const { viem } = await network.connect();
  const walletClients = await viem.getWalletClients();
  
  // Check if we have a wallet client
  if (!walletClients || walletClients.length === 0) {
    console.error("\n❌ Error: No wallet found!");
    console.error("\n💡 Solution: You need to set CELO_PRIVATE_KEY");
    console.error("\nOption 1: Use Hardhat Keystore (Recommended)");
    console.error("  npx hardhat keystore set CELO_PRIVATE_KEY");
    console.error("\nOption 2: Use Environment Variable");
    console.error("  Create a .env file with:");
    console.error("  CELO_PRIVATE_KEY=0xYourPrivateKeyHere");
    console.error("\n⚠️  Make sure your private key starts with '0x'");
    process.exit(1);
  }
  
  const [deployer] = walletClients;
  const publicClient = await viem.getPublicClient();
  
  // Get network name and chain ID
  const chainId = await publicClient.getChainId();
  let networkName = "celo";
  
  const chainIdMap: Record<number, string> = {
    11142220: "celoSepolia", // Celo Sepolia Testnet
    44787: "alfajores", // Celo Alfajores Testnet
    42220: "celo", // Celo Mainnet
  };
  
  if (chainIdMap[chainId]) {
    networkName = chainIdMap[chainId];
  }
  
  console.log("🚀 Deploying DiplomaVerification to Celo...");
  console.log("Network:", networkName);
  console.log("Chain ID:", chainId);
  console.log("Deployer address:", deployer.account.address);
  
  // Check balance
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  
  // Celo uses cGLD/cUSD, but balance is in wei (same as ETH)
  const balanceInCelo = Number(balance) / 1e18;
  const tokenName = networkName === "celoSepolia" || networkName === "alfajores" ? "CELO (testnet)" : "CELO";
  console.log("Balance:", balanceInCelo.toFixed(4), tokenName);
  
  if (balanceInCelo < 0.01) {
    console.warn("⚠️  Warning: Low balance! You may not have enough CELO for deployment.");
    if (networkName === "celoSepolia") {
      console.warn("💡 Get testnet tokens from: https://faucet.celo.org/");
    } else if (networkName === "alfajores") {
      console.warn("💡 Get testnet tokens from: https://faucet.celo.org/alfajores");
    }
  }
  
  console.log("\n⏳ Deploying contract...");
  
  const deploymentStartTime = Date.now();
  const diplomaVerification = await viem.deployContract("DiplomaVerification");
  const deploymentEndTime = Date.now();
  
  // Wait for transaction to be confirmed
  console.log("⏳ Waiting for transaction confirmation...");
  await publicClient.waitForTransactionReceipt({ 
    hash: diplomaVerification.deploymentTransaction as `0x${string}`,
    confirmations: 1 
  });
  
  const blockNumber = await publicClient.getBlockNumber();
  const deployerBalance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  
  console.log("\n✅ Contract deployed successfully!");
  console.log("════════════════════════════════════════");
  console.log("📋 Deployment Information");
  console.log("════════════════════════════════════════");
  console.log("Contract Address:", diplomaVerification.address);
  console.log("Network:", networkName);
  console.log("Chain ID:", chainId);
  console.log("Admin Address:", deployer.account.address);
  console.log("Block Number:", blockNumber.toString());
  console.log("Deployment Time:", (deploymentEndTime - deploymentStartTime), "ms");
  const tokenSymbol = networkName === "celoSepolia" || networkName === "alfajores" ? "CELO" : "CELO";
  console.log("Deployer Balance:", (Number(deployerBalance) / 1e18).toFixed(4), tokenSymbol);
  
  // Verify admin (with error handling)
  try {
    const admin = await diplomaVerification.read.admin();
    console.log("Contract Admin:", admin);
  } catch (error) {
    console.log("Contract Admin:", deployer.account.address, "(verify may take a moment)");
  }
  console.log("════════════════════════════════════════\n");
  
  // Save deployment info
  const deploymentInfo = {
    network: networkName,
    chainId: chainId.toString(),
    contractAddress: diplomaVerification.address,
    adminAddress: deployer.account.address,
    blockNumber: blockNumber.toString(),
    deployDate: new Date().toISOString(),
    deployerBalance: (Number(deployerBalance) / 1e18).toString(),
    deploymentTime: `${deploymentEndTime - deploymentStartTime}ms`,
  };
  
  // Create deployments directory
  const deploymentsDir = join(process.cwd(), "deployments");
  if (!existsSync(deploymentsDir)) {
    mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save JSON file
  const fileName = `deployment-${networkName}-${Date.now()}.json`;
  const filePath = join(deploymentsDir, fileName);
  writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", filePath);
  
  // Save latest.json
  const latestPath = join(deploymentsDir, `latest-${networkName}.json`);
  writeFileSync(latestPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Latest deployment info saved to:", latestPath);
  
  // Next steps
  console.log("\n📝 Next Steps:");
  console.log("1. Save the contract address above");
  console.log("2. View on Celo Explorer:");
  if (networkName === "celoSepolia") {
    console.log(`   https://explorer.celo.org/sepolia/address/${diplomaVerification.address}`);
  } else if (networkName === "alfajores") {
    console.log(`   https://alfajores.celoscan.io/address/${diplomaVerification.address}`);
  } else {
    console.log(`   https://celoscan.io/address/${diplomaVerification.address}`);
  }
  console.log("3. Update CONTRACT_ADDRESS in your scripts");
  console.log("4. Add your first diploma:");
  console.log(`   npx hardhat run scripts/add-diploma.ts --network ${networkName}`);
  
  console.log("\n✨ Deployment completed!\n");
  
  return {
    contractAddress: diplomaVerification.address,
    deploymentInfo,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed!");
    console.error(error);
    process.exit(1);
  });

