import { keccak256, encodePacked } from "viem";

/**
 * Script helper để tính hash của bằng cấp
 * 
 * Usage: npx hardhat run scripts/calculate-hash.ts
 * 
 * Script này giúp bạn tính hash trước khi thêm vào contract
 * Bạn có thể sử dụng hash này để verify sau này
 */

// ===== THÔNG TIN BẰNG CẤP =====
// Thay đổi các giá trị này theo bằng cấp thực tế

// Hash của file PDF bằng cấp (tính từ PDF file)
// Có thể dùng: keccak256(pdfBytes) hoặc hash từ IPFS
const PDF_HASH = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

// Mã sinh viên
const STUDENT_ID = "SV2024001";

// Ngày tốt nghiệp (format: YYYY-MM-DD)
const GRADUATION_DATE = "2024-06-15";

// Loại bằng cấp
const DEGREE = "Bachelor of Computer Science";

// Các thông tin bổ sung (optional)
const ADDITIONAL_INFO = {
  major: "Computer Science",
  gpa: "3.8",
  honors: "Summa Cum Laude",
};
// ===============================

async function main() {
  console.log("🔐 Calculating Diploma Hash\n");
  console.log("📄 Input Data:");
  console.log("- PDF Hash:", PDF_HASH);
  console.log("- Student ID:", STUDENT_ID);
  console.log("- Graduation Date:", GRADUATION_DATE);
  console.log("- Degree:", DEGREE);
  console.log("- Additional Info:", JSON.stringify(ADDITIONAL_INFO, null, 2));
  
  // Tính hash cơ bản (không có additional info)
  const basicHash = keccak256(
    encodePacked(
      ["bytes32", "string", "string", "string"],
      [
        PDF_HASH as `0x${string}`,
        STUDENT_ID,
        GRADUATION_DATE,
        DEGREE,
      ]
    )
  );
  
  console.log("\n✅ Basic Diploma Hash:", basicHash);
  
  // Tính hash với additional info (nếu cần chi tiết hơn)
  const detailedHash = keccak256(
    encodePacked(
      ["bytes32", "string", "string", "string", "string", "string", "string"],
      [
        PDF_HASH as `0x${string}`,
        STUDENT_ID,
        GRADUATION_DATE,
        DEGREE,
        ADDITIONAL_INFO.major,
        ADDITIONAL_INFO.gpa,
        ADDITIONAL_INFO.honors,
      ]
    )
  );
  
  console.log("✅ Detailed Diploma Hash (with additional info):", detailedHash);
  
  console.log("\n💡 Usage:");
  console.log("1. Copy hash above");
  console.log("2. Use in scripts/add-diploma.ts or scripts/verify-diploma.ts");
  console.log("3. Store this hash securely - it's needed for verification");
  
  console.log("\n⚠️  Important Notes:");
  console.log("- Use the SAME data structure when verifying");
  console.log("- PDF hash should be calculated from the actual PDF file");
  console.log("- Hash is deterministic - same input = same hash");
  console.log("- Keep original data to recreate hash for verification");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

