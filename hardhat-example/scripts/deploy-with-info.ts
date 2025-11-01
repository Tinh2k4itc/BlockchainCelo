import { network } from "hardhat";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Script deploy và tự động lưu thông tin deployment
 * 
 * Usage:
 * - Local: npx hardhat run scripts/deploy-with-info.ts
 * - Sepolia: npx hardhat run scripts/deploy-with-info.ts --network sepolia
 */
async function main() {
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  
  // Get network name - try to detect from chain ID or use default
  // Note: In Hardhat 3, we detect network from chain ID since network.name is not available
  let networkName = "hardhat"; // Default
  
  // Try to detect network from chain ID
  try {
    const chainId = await publicClient.getChainId();
    // Common chain IDs mapping
    const chainIdMap: Record<number, string> = {
      1: "mainnet",
      11155111: "sepolia",
      31337: "hardhatMainnet", // Local Hardhat network (hardhatMainnet uses this)
      11142220: "celoSepolia", // Celo Sepolia testnet
      44787: "alfajores", // Celo Alfajores testnet
      42220: "celo", // Celo mainnet
    };
    if (chainIdMap[chainId]) {
      networkName = chainIdMap[chainId];
    } else {
      // If not in map, use chain ID as network name
      networkName = `chain-${chainId}`;
    }
  } catch (e) {
    // If we can't get chain ID, use default
    console.warn("Could not detect chain ID, using default network name");
  }
  
  console.log("🚀 Deploying DiplomaVerification contract...");
  console.log("Network:", networkName);
  console.log("Deployer address:", deployer.account.address);
  
  // Kiểm tra số dư (nếu không phải local)
  if (networkName !== "hardhat" && networkName !== "hardhatMainnet") {
    const balance = await publicClient.getBalance({
      address: deployer.account.address,
    });
    const balanceInEth = Number(balance) / 1e18;
    console.log("Balance:", balanceInEth.toFixed(4), "ETH");
    
    if (balanceInEth < 0.001) {
      console.warn("⚠️  Warning: Low balance! You may not have enough ETH for deployment.");
    }
  }
  
  console.log("\n⏳ Deploying contract...");
  
  const deploymentStartTime = Date.now();
  const diplomaVerification = await viem.deployContract("DiplomaVerification");
  const deploymentEndTime = Date.now();
  
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
  console.log("Admin Address:", deployer.account.address);
  console.log("Block Number:", blockNumber.toString());
  console.log("Deployment Time:", (deploymentEndTime - deploymentStartTime), "ms");
  console.log("Deployer Balance:", (Number(deployerBalance) / 1e18).toFixed(4), "ETH");
  
  // Verify admin
  const admin = await diplomaVerification.read.admin();
  console.log("Contract Admin:", admin);
  console.log("════════════════════════════════════════\n");
  
  // Lưu thông tin deployment
  const deploymentInfo = {
    network: networkName,
    contractAddress: diplomaVerification.address,
    adminAddress: deployer.account.address,
    blockNumber: blockNumber.toString(),
    deployDate: new Date().toISOString(),
    deployerBalance: (Number(deployerBalance) / 1e18).toString(),
    deploymentTime: `${deploymentEndTime - deploymentStartTime}ms`,
  };
  
  // Tạo thư mục deployments nếu chưa có
  const deploymentsDir = join(process.cwd(), "deployments");
  if (!existsSync(deploymentsDir)) {
    mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Lưu file JSON
  const fileName = `deployment-${networkName}-${Date.now()}.json`;
  const filePath = join(deploymentsDir, fileName);
  writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", filePath);
  
  // Lưu file latest.json
  const latestPath = join(deploymentsDir, `latest-${networkName}.json`);
  writeFileSync(latestPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Latest deployment info saved to:", latestPath);
  
  // In hướng dẫn tiếp theo
  console.log("\n📝 Next Steps:");
  console.log("1. Save the contract address above");
  console.log("2. Update CONTRACT_ADDRESS in your scripts:");
  console.log("   - scripts/add-diploma.ts");
  console.log("   - scripts/verify-diploma.ts");
  console.log("3. Add your first diploma:");
  console.log(`   npx hardhat run scripts/add-diploma.ts --network ${networkName}`);
  console.log("4. Verify a diploma:");
  console.log(`   npx hardhat run scripts/verify-diploma.ts --network ${networkName}`);
  
  if (networkName === "sepolia") {
    console.log("\n🔍 View on Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${diplomaVerification.address}`);
  }
  
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

