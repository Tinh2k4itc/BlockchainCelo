import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAddress, type Address } from "viem";
import { hashMessage } from "viem";

import { network } from "hardhat";

describe("DiplomaVerification", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [admin, student, employer, other] = await viem.getWalletClients();

  it("Should deploy contract and set deployer as admin", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    const adminAddress = await diplomaContract.read.admin();
    
    assert.equal(
      adminAddress.toLowerCase(),
      admin.account.address.toLowerCase(),
      "Admin should be the deployer"
    );
  });

  it("Should emit DiplomaIssued event when admin adds a diploma", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    
    // Tạo hash giả lập cho bằng cấp
    const diplomaHash = hashMessage("Diploma for student 12345");
    const studentAddress = student.account.address;
    const grades = [85n, 90n, 88n, 92n, 87n]; // Điểm số các môn học
    
    await viem.assertions.emitWithArgs(
      diplomaContract.write.addDiploma([
        diplomaHash,
        studentAddress,
        grades,
      ]),
      diplomaContract,
      "DiplomaIssued",
      [diplomaHash, studentAddress],
    );
  });

  it("Should only allow admin to add diplomas", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    
    const diplomaHash = hashMessage("Test diploma");
    const grades = [85n, 90n];
    
    // Student không thể thêm bằng cấp
    await assert.rejects(
      async () => {
        await diplomaContract.write.addDiploma([
          diplomaHash,
          student.account.address,
          grades,
        ], {
          account: student.account,
        });
      },
      /Only admin can perform this action/,
      "Non-admin should not be able to add diploma"
    );
  });

  it("Should verify diploma correctly", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    
    const diplomaHash = hashMessage("Verified diploma");
    const studentAddress = student.account.address;
    const grades = [95n, 98n, 97n];
    
    // Admin thêm bằng cấp
    await diplomaContract.write.addDiploma([
      diplomaHash,
      studentAddress,
      grades,
    ]);
    
    // Employer verify bằng cấp
    const [exists, returnedStudent, issueDate, returnedGrades] = 
      await diplomaContract.read.verify([diplomaHash], {
        account: employer.account,
      });
    
    assert.equal(exists, true, "Diploma should exist");
    assert.equal(
      returnedStudent.toLowerCase(),
      studentAddress.toLowerCase(),
      "Student address should match"
    );
    assert.ok(issueDate > 0n, "Issue date should be set");
    assert.deepEqual(returnedGrades, grades, "Grades should match");
  });

  it("Should return false when verifying non-existent diploma", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    
    const fakeHash = hashMessage("Non-existent diploma");
    
    const [exists] = await diplomaContract.read.verify([fakeHash]);
    
    assert.equal(exists, false, "Non-existent diploma should return false");
  });

  it("Should prevent adding duplicate diplomas", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    
    const diplomaHash = hashMessage("Duplicate test");
    const grades = [80n, 85n];
    
    // Thêm bằng cấp lần đầu
    await diplomaContract.write.addDiploma([
      diplomaHash,
      student.account.address,
      grades,
    ]);
    
    // Thử thêm lại cùng hash
    await assert.rejects(
      async () => {
        await diplomaContract.write.addDiploma([
          diplomaHash,
          student.account.address,
          grades,
        ]);
      },
      /Diploma already exists/,
      "Should not allow duplicate diploma hash"
    );
  });

  it("Should track all diplomas for a student", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    
    const studentAddress = student.account.address;
    const hash1 = hashMessage("Diploma 1");
    const hash2 = hashMessage("Diploma 2");
    const grades = [85n, 90n];
    
    // Thêm 2 bằng cấp cho cùng một sinh viên
    await diplomaContract.write.addDiploma([hash1, studentAddress, grades]);
    await diplomaContract.write.addDiploma([hash2, studentAddress, grades]);
    
    const studentDiplomas = await diplomaContract.read.getStudentDiplomas([
      studentAddress,
    ]);
    
    assert.equal(studentDiplomas.length, 2, "Student should have 2 diplomas");
    assert.equal(
      studentDiplomas[0].toLowerCase(),
      hash1.toLowerCase(),
      "First diploma hash should match"
    );
    assert.equal(
      studentDiplomas[1].toLowerCase(),
      hash2.toLowerCase(),
      "Second diploma hash should match"
    );
  });

  it("Should get total number of diplomas", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    
    const grades = [85n, 90n];
    
    // Thêm 3 bằng cấp
    await diplomaContract.write.addDiploma([
      hashMessage("Diploma A"),
      student.account.address,
      grades,
    ]);
    await diplomaContract.write.addDiploma([
      hashMessage("Diploma B"),
      employer.account.address,
      grades,
    ]);
    await diplomaContract.write.addDiploma([
      hashMessage("Diploma C"),
      other.account.address,
      grades,
    ]);
    
    const total = await diplomaContract.read.getTotalDiplomas();
    assert.equal(total, 3n, "Total diplomas should be 3");
  });

  it("Should allow admin to change admin", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    
    const newAdmin = employer.account.address;
    
    await viem.assertions.emitWithArgs(
      diplomaContract.write.changeAdmin([newAdmin]),
      diplomaContract,
      "AdminChanged",
      [admin.account.address, newAdmin],
    );
    
    const updatedAdmin = await diplomaContract.read.admin();
    assert.equal(
      updatedAdmin.toLowerCase(),
      newAdmin.toLowerCase(),
      "Admin should be changed"
    );
    
    // Admin mới có thể thêm bằng cấp
    const hash = hashMessage("New admin test");
    const grades = [90n];
    
    await diplomaContract.write.addDiploma([
      hash,
      student.account.address,
      grades,
    ], {
      account: employer.account,
    });
    
    const [exists] = await diplomaContract.read.verify([hash]);
    assert.equal(exists, true, "New admin should be able to add diploma");
  });

  it("Should reject invalid inputs", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    
    const zeroHash = "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;
    const zeroAddress = "0x0000000000000000000000000000000000000000" as Address;
    const grades = [85n];
    
    // Không thể thêm bằng cấp với hash = 0
    await assert.rejects(
      async () => {
        await diplomaContract.write.addDiploma([
          zeroHash,
          student.account.address,
          grades,
        ]);
      },
      /Diploma hash cannot be zero/,
      "Should reject zero hash"
    );
    
    // Không thể thêm bằng cấp với địa chỉ = 0
    await assert.rejects(
      async () => {
        await diplomaContract.write.addDiploma([
          hashMessage("Valid hash"),
          zeroAddress,
          grades,
        ]);
      },
      /Student address cannot be zero/,
      "Should reject zero address"
    );
  });

  it("Should get full diploma information", async function () {
    const diplomaContract = await viem.deployContract("DiplomaVerification");
    
    const diplomaHash = hashMessage("Full info diploma");
    const studentAddress = student.account.address;
    const grades = [95n, 98n, 92n];
    
    await diplomaContract.write.addDiploma([
      diplomaHash,
      studentAddress,
      grades,
    ]);
    
    const deploymentBlock = await publicClient.getBlockNumber();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Đợi một chút
    
    const diploma = await diplomaContract.read.getDiploma([diplomaHash]);
    
    assert.equal(
      diploma.diplomaHash.toLowerCase(),
      diplomaHash.toLowerCase(),
      "Hash should match"
    );
    assert.equal(
      diploma.studentAddress.toLowerCase(),
      studentAddress.toLowerCase(),
      "Student address should match"
    );
    assert.ok(diploma.issueDate > 0n, "Issue date should be set");
    assert.deepEqual(diploma.grades, grades, "Grades should match");
    assert.equal(diploma.exists, true, "Should exist");
  });
});


