import { network } from "hardhat";
import { keccak256, encodePacked, getAddress } from "viem";

/**
 * Script để thêm bằng cấp mới vào contract
 * 
 * Usage:
 * npx hardhat run scripts/add-diploma.ts --network <network>
 * 
 * Lưu ý: Bạn cần set CONTRACT_ADDRESS và STUDENT_ADDRESS trước khi chạy
 * Hoặc sửa hardcode trong script này
 */

// ===== CẤU HÌNH =====
// Thay đổi các giá trị này theo nhu cầu
const CONTRACT_ADDRESS = "0xfdaa553d5652f6f481b1c65b4c9f8bdb65ea6403"; // Contract đã deploy trên Celo Sepolia
const STUDENT_ADDRESS = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"; // Địa chỉ ví của sinh viên (có thể thay đổi)

// Thông tin bằng cấp (ví dụ)
const DIPLOMA_DATA = {
  pdfHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", // Hash của file PDF bằng cấp
  studentId: "SV2024001", // Mã sinh viên
  graduationDate: "2024-11-01", // Ngày tốt nghiệp
  degree: "Bachelor of Computer Science", // Bằng cấp
};

const GRADES = [85, 90, 88, 92, 87, 89]; // Điểm số các môn học
// ====================

async function main() {
  const { viem } = await network.connect();
  const [admin] = await viem.getWalletClients();
  
  console.log("Adding diploma to contract...");
  console.log("Admin address:", admin.account.address);
  
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x...") {
    throw new Error("Please set CONTRACT_ADDRESS in the script");
  }
  
  if (!STUDENT_ADDRESS || STUDENT_ADDRESS === "0x...") {
    throw new Error("Please set STUDENT_ADDRESS in the script");
  }
  
  // Tạo hash của bằng cấp từ các thông tin
  // Hash này bao gồm: PDF hash + student ID + graduation date + degree
  // Đảm bảo tính bảo mật - không lưu trữ dữ liệu cá nhân on-chain
  const diplomaHash = keccak256(
    encodePacked(
      ["bytes32", "string", "string", "string"],
      [
        DIPLOMA_DATA.pdfHash as `0x${string}`,
        DIPLOMA_DATA.studentId,
        DIPLOMA_DATA.graduationDate,
        DIPLOMA_DATA.degree,
      ]
    )
  );
  
  console.log("\n📄 Diploma Information:");
  console.log("- PDF Hash:", DIPLOMA_DATA.pdfHash);
  console.log("- Student ID:", DIPLOMA_DATA.studentId);
  console.log("- Graduation Date:", DIPLOMA_DATA.graduationDate);
  console.log("- Degree:", DIPLOMA_DATA.degree);
  console.log("- Grades:", GRADES);
  console.log("\n🔐 Generated Diploma Hash:", diplomaHash);
  
  // Kết nối với contract
  const diplomaVerification = await viem.getContractAt(
    "DiplomaVerification",
    CONTRACT_ADDRESS as `0x${string}`
  );
  
  // Kiểm tra admin
  const contractAdmin = await diplomaVerification.read.admin();
  if (contractAdmin.toLowerCase() !== admin.account.address.toLowerCase()) {
    throw new Error("Current account is not the admin of this contract");
  }
  
  // Chuyển đổi grades sang BigInt
  const gradesBigInt = GRADES.map(g => BigInt(g));
  const studentAddr = getAddress(STUDENT_ADDRESS);
  
  console.log("\n⏳ Adding diploma to blockchain...");
  
  // Thêm bằng cấp
  const txHash = await diplomaVerification.write.addDiploma([
    diplomaHash,
    studentAddr,
    gradesBigInt,
  ]);
  
  console.log("Transaction hash:", txHash);
  
  // Đợi transaction được confirm
  const publicClient = await viem.getPublicClient();
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  
  console.log("\n✅ Diploma added successfully!");
  console.log("Block number:", receipt.blockNumber);
  console.log("Diploma Hash:", diplomaHash);
  console.log("\n💡 You can now verify this diploma using:");
  console.log(`   npx hardhat run scripts/verify-diploma.ts --network <network>`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

