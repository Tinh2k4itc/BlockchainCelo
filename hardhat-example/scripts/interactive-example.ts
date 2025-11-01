import { network } from "hardhat";
import { keccak256, encodePacked, parseAddress } from "viem";

/**
 * Script tương tác ví dụ - thêm và verify bằng cấp
 * Script này tự động deploy contract, thêm bằng cấp và verify
 * 
 * Usage: npx hardhat run scripts/interactive-example.ts
 */

async function main() {
  const { viem } = await network.connect();
  const [admin, student] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  
  console.log("🚀 Starting Diploma Verification DApp Demo\n");
  console.log("Admin address:", admin.account.address);
  console.log("Student address:", student.account.address);
  
  // 1. Deploy contract
  console.log("\n📝 Step 1: Deploying DiplomaVerification contract...");
  const diplomaVerification = await viem.deployContract("DiplomaVerification");
  console.log("✅ Contract deployed at:", diplomaVerification.address);
  
  // 2. Tạo dữ liệu bằng cấp mẫu
  console.log("\n📋 Step 2: Creating sample diploma data...");
  const diplomaData = {
    pdfHash: keccak256(encodePacked(["string"], ["diploma_pdf_content_sample"])),
    studentId: "SV2024001",
    graduationDate: "2024-06-15",
    degree: "Bachelor of Computer Science",
  };
  
  // Tạo hash của bằng cấp
  const diplomaHash = keccak256(
    encodePacked(
      ["bytes32", "string", "string", "string"],
      [
        diplomaData.pdfHash,
        diplomaData.studentId,
        diplomaData.graduationDate,
        diplomaData.degree,
      ]
    )
  );
  
  console.log("Diploma Hash:", diplomaHash);
  console.log("Student ID:", diplomaData.studentId);
  console.log("Degree:", diplomaData.degree);
  
  // 3. Thêm bằng cấp (admin)
  console.log("\n📝 Step 3: Adding diploma to blockchain (Admin action)...");
  const grades = [85n, 90n, 88n, 92n, 87n, 89n];
  
  const txHash = await diplomaVerification.write.addDiploma([
    diplomaHash,
    student.account.address,
    grades,
  ]);
  
  console.log("Transaction hash:", txHash);
  await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("✅ Diploma added successfully!");
  
  // 4. Verify bằng cấp (có thể là employer hoặc bất kỳ ai)
  console.log("\n🔍 Step 4: Verifying diploma (Public verification)...");
  const [exists, returnedStudent, issueDate, returnedGrades] = 
    await diplomaVerification.read.verify([diplomaHash]);
  
  if (exists) {
    console.log("✅ VERIFICATION SUCCESSFUL!");
    console.log("Student Address:", returnedStudent);
    console.log("Issue Date:", new Date(Number(issueDate) * 1000).toLocaleString());
    console.log("Grades:", returnedGrades.map(g => Number(g)).join(", "));
    
    const avgGrade = returnedGrades.reduce((sum, g) => sum + g, 0n) / BigInt(returnedGrades.length);
    console.log("Average Grade:", avgGrade.toString());
  } else {
    console.log("❌ Verification failed!");
  }
  
  // 5. Lấy thông tin chi tiết
  console.log("\n📊 Step 5: Getting detailed diploma information...");
  const diploma = await diplomaVerification.read.getDiploma([diplomaHash]);
  console.log("Full Diploma Info:", {
    hash: diploma.diplomaHash,
    student: diploma.studentAddress,
    issueDate: new Date(Number(diploma.issueDate) * 1000).toISOString(),
    grades: diploma.grades.map(g => Number(g)),
    exists: diploma.exists,
  });
  
  // 6. Lấy danh sách bằng cấp của sinh viên
  console.log("\n📚 Step 6: Getting all diplomas for student...");
  const studentDiplomas = await diplomaVerification.read.getStudentDiplomas([
    student.account.address
  ]);
  console.log("Student has", studentDiplomas.length, "diploma(s)");
  
  // 7. Tổng số bằng cấp trên contract
  console.log("\n📈 Step 7: Contract statistics...");
  const totalDiplomas = await diplomaVerification.read.getTotalDiplomas();
  console.log("Total diplomas on contract:", totalDiplomas.toString());
  
  console.log("\n✨ Demo completed successfully!");
  console.log("\n💡 Next steps:");
  console.log("1. Save contract address:", diplomaVerification.address);
  console.log("2. Use scripts/add-diploma.ts to add more diplomas");
  console.log("3. Use scripts/verify-diploma.ts to verify diplomas");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

