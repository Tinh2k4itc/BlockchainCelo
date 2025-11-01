import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DiplomaVerificationModule", (m) => {
  // Deploy DiplomaVerification contract
  // Admin sẽ được tự động set là người deploy contract
  const diplomaVerification = m.contract("DiplomaVerification");

  return { diplomaVerification };
});


