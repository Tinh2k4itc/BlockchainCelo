import { network } from "hardhat";
import { parseAddress } from "viem";

/**
 * Script để xác minh bằng cấp
 * 
 * Usage:
 * npx hardhat run scripts/verify-diploma.ts --network <network>
 * 
 * Lưu ý: Set CONTRACT_ADDRESS và DIPLOMA_HASH trước khi chạy
 */

// ===== CẤU HÌNH =====
const CONTRACT_ADDRESS = "0xfdaa553d5652f6f481b1c65b4c9f8bdb65ea6403"; // Contract đã deploy
const DIPLOMA_HASH = "0x74f95bb1083038385aba24db428cf14449861111872ea9e0e7c5dd553bc710d5"; // Hash của bằng cấp vừa thêm
// ====================

async function main() {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  
  console.log("Verifying diploma...");
  
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x...") {
    throw new Error("Please set CONTRACT_ADDRESS in the script");
  }
  
  if (!DIPLOMA_HASH || DIPLOMA_HASH === "0x...") {
    throw new Error("Please set DIPLOMA_HASH in the script");
  }
  
  // Kết nối với contract
  const diplomaVerification = await viem.getContractAt(
    "DiplomaVerification",
    CONTRACT_ADDRESS as `0x${string}`
  );
  
  console.log("Contract address:", CONTRACT_ADDRESS);
  console.log("Diploma hash:", DIPLOMA_HASH);
  console.log("\n⏳ Checking diploma on blockchain...\n");
  
  // Xác minh bằng cấp
  const [exists, studentAddress, issueDate, grades] = 
    await diplomaVerification.read.verify([DIPLOMA_HASH as `0x${string}`]);
  
  // Hiển thị kết quả
  console.log("════════════════════════════════════════");
  console.log("📋 VERIFICATION RESULT");
  console.log("════════════════════════════════════════");
  
  if (exists) {
    console.log("✅ DIPLOMA VERIFIED");
    console.log("\n📄 Diploma Information:");
    console.log("- Student Address:", studentAddress);
    console.log("- Issue Date:", new Date(Number(issueDate) * 1000).toLocaleString());
    console.log("- Grades:", grades.map(g => Number(g)).join(", "));
    console.log("- Average Grade:", 
      (grades.reduce((sum, g) => sum + g, 0n) / BigInt(grades.length)).toString());
    
    // Lấy thông tin chi tiết hơn
    const diploma = await diplomaVerification.read.getDiploma([
      DIPLOMA_HASH as `0x${string}`
    ]);
    
    console.log("\n🔐 Technical Details:");
    console.log("- Diploma Hash:", diploma.diplomaHash);
    console.log("- Exists:", diploma.exists);
    
    // Kiểm tra xem sinh viên có bao nhiêu bằng cấp
    const studentDiplomas = await diplomaVerification.read.getStudentDiplomas([
      studentAddress
    ]);
    console.log("- Total diplomas for this student:", studentDiplomas.length);
    
  } else {
    console.log("❌ DIPLOMA NOT FOUND");
    console.log("\nThis diploma hash does not exist on the blockchain.");
    console.log("Possible reasons:");
    console.log("1. The diploma has not been issued yet");
    console.log("2. The hash is incorrect");
    console.log("3. The diploma was issued on a different contract");
  }
  
  console.log("════════════════════════════════════════\n");
  
  // Lấy tổng số bằng cấp
  const totalDiplomas = await diplomaVerification.read.getTotalDiplomas();
  console.log("📊 Total diplomas on contract:", totalDiplomas.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

