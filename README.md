# DApp Xác Minh Bằng Cấp Đại Học trên Blockchain

Dự án DApp xác minh bằng cấp đại học được xây dựng trên Hardhat, sử dụng Solidity và Viem. Hệ thống cho phép đại học (admin) cấp bằng cấp trên blockchain, và bất kỳ ai cũng có thể xác minh tính hợp lệ của bằng cấp.

## 🌟 Tính Năng

- **Lưu trữ hash của bằng cấp**: Bảo mật dữ liệu cá nhân, chỉ lưu hash on-chain
- **Phân quyền Admin**: Chỉ đại học (admin) mới có thể cấp bằng cấp
- **Xác minh công khai**: Bất kỳ ai cũng có thể verify bằng cấp bằng hash
- **Lưu trữ điểm số**: Mỗi bằng cấp có mảng điểm số chi tiết
- **Events theo dõi**: Event `DiplomaIssued` để theo dõi mọi bằng cấp được cấp
- **Immutability**: Dữ liệu on-chain không thể chỉnh sửa, đảm bảo tính minh bạch

## 📋 Yêu Cầu

- Node.js >= 18
- npm hoặc yarn

## 🚀 Cài Đặt

```bash
npm install
```

## 🧪 Chạy Tests

```bash
# Chạy tất cả tests
npx hardhat test

# Chạy test cho DiplomaVerification
npx hardhat test test/DiplomaVerification.ts

# Chạy test Solidity
npx hardhat test solidity

# Chạy test Node.js/TypeScript
npx hardhat test nodejs
```

## 📝 Smart Contract

### DiplomaVerification.sol

Contract chính với các chức năng:

- `addDiploma(bytes32 diplomaHash, address studentAddress, uint256[] grades)`: Thêm bằng cấp mới (chỉ admin)
- `verify(bytes32 diplomaHash)`: Xác minh bằng cấp (public)
- `getDiploma(bytes32 diplomaHash)`: Lấy thông tin chi tiết bằng cấp
- `getStudentDiplomas(address studentAddress)`: Lấy danh sách bằng cấp của sinh viên
- `changeAdmin(address newAdmin)`: Thay đổi admin (chỉ admin hiện tại)
- `getTotalDiplomas()`: Lấy tổng số bằng cấp đã cấp

### Events

- `DiplomaIssued(bytes32 indexed diplomaHash, address indexed studentAddress, uint256 issueDate, uint256[] grades)`
- `AdminChanged(address indexed oldAdmin, address indexed newAdmin)`

## 🎯 Sử Dụng

> 📘 **Hướng dẫn deploy chi tiết**: Xem [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)  
> ⚡ **Quick Start**: Xem [QUICK_START.md](./QUICK_START.md) để deploy nhanh trong 5 phút  
> 🌍 **Deploy lên Celo**: Xem [CELO_QUICK_START.md](./CELO_QUICK_START.md) hoặc [CELO_SETUP.md](./CELO_SETUP.md)

### 1. Deploy Contract

**Local Network (Test nhanh)**
```bash
npx hardhat run scripts/deploy-with-info.ts --network hardhatMainnet
```

**Celo Alfajores Testnet (Khuyến nghị cho production testing)**
```bash
# Xem hướng dẫn setup: CELO_QUICK_START.md
npx hardhat run scripts/deploy-celo.ts --network alfajores
```

**Sepolia Testnet**
```bash
npx hardhat run scripts/deploy-with-info.ts --network sepolia
```

**Celo Mainnet**
```bash
# Chỉ deploy sau khi đã test kỹ trên testnet!
npx hardhat run scripts/deploy-celo.ts --network celo
```

**Sử dụng Ignition**
```bash
# Deploy lên local network
npx hardhat ignition deploy ignition/modules/DiplomaVerification.ts

# Deploy lên các network khác
npx hardhat ignition deploy --network <network-name> ignition/modules/DiplomaVerification.ts
```

### 2. Demo Tự Động (Interactive Example)

Script tự động deploy, thêm bằng cấp và verify:

```bash
npx hardhat run scripts/interactive-example.ts
```

### 3. Thêm Bằng Cấp (Admin)

Chỉnh sửa `scripts/add-diploma.ts`:
- Set `CONTRACT_ADDRESS`: Địa chỉ contract đã deploy
- Set `STUDENT_ADDRESS`: Địa chỉ ví của sinh viên
- Cấu hình thông tin bằng cấp và điểm số

Sau đó chạy:
```bash
npx hardhat run scripts/add-diploma.ts --network <network>
```

### 4. Xác Minh Bằng Cấp

Chỉnh sửa `scripts/verify-diploma.ts`:
- Set `CONTRACT_ADDRESS`: Địa chỉ contract
- Set `DIPLOMA_HASH`: Hash của bằng cấp cần xác minh

Sau đó chạy:
```bash
npx hardhat run scripts/verify-diploma.ts --network <network>
```

## 🔐 Bảo Mật và Hash

Để tạo hash của bằng cấp, bạn nên kết hợp:
- Hash của file PDF bằng cấp
- Mã sinh viên
- Ngày tốt nghiệp
- Loại bằng cấp
- Và các thông tin khác

Ví dụ trong Solidity:
```solidity
bytes32 diplomaHash = keccak256(abi.encodePacked(
    pdfHash,
    studentId,
    graduationDate,
    degree
));
```

**Lưu ý**: Hash được tính từ các thông tin này, đảm bảo:
- Dữ liệu cá nhân không được lưu trữ trực tiếp on-chain
- Chỉ hash được lưu trữ, đảm bảo privacy
- Người có PDF gốc có thể tái tạo hash để verify

## 🌐 Networks

Dự án hỗ trợ:
- **Hardhat Local Network**: Mặc định khi không chỉ định network
- **Sepolia Testnet**: Cần set `SEPOLIA_PRIVATE_KEY` và `SEPOLIA_RPC_URL`

### Setup Sepolia Testnet

1. Set private key:
```bash
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

2. Set RPC URL (trong `.env` hoặc config):
```bash
export SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_API_KEY"
```

3. Deploy:
```bash
npx hardhat ignition deploy --network sepolia ignition/modules/DiplomaVerification.ts
```

## 📊 Workflow

1. **Đại học (Admin)**:
   - Deploy contract → Trở thành admin
   - Tạo hash từ thông tin bằng cấp
   - Gọi `addDiploma()` để cấp bằng

2. **Sinh viên**:
   - Nhận hash của bằng cấp
   - Có thể verify bằng cấp của mình
   - Có thể chia sẻ hash cho nhà tuyển dụng

3. **Nhà tuyển dụng**:
   - Nhận hash từ sinh viên
   - Gọi `verify()` để kiểm tra tính hợp lệ
   - Xem điểm số và thông tin khác

## 🛠️ Cấu Trúc Dự Án

```
hardhat-example/
├── contracts/
│   ├── DiplomaVerification.sol    # Smart contract chính
│   └── Counter.sol                 # Contract mẫu
├── test/
│   ├── DiplomaVerification.ts     # Tests cho contract
│   └── Counter.ts                 # Tests mẫu
├── scripts/
│   ├── deploy-diploma.ts          # Script deploy
│   ├── add-diploma.ts             # Script thêm bằng cấp
│   ├── verify-diploma.ts          # Script verify
│   └── interactive-example.ts     # Demo tự động
├── ignition/
│   └── modules/
│       └── DiplomaVerification.ts # Ignition deployment module
├── hardhat.config.ts              # Hardhat config
└── package.json
```

## 📚 Tài Liệu Tham Khảo

- [Hardhat Documentation](https://hardhat.org/docs)
- [Viem Documentation](https://viem.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 🔄 Lợi Ích của Blockchain

1. **Immutability**: Dữ liệu không thể thay đổi sau khi ghi
2. **Transparency**: Tất cả giao dịch công khai trên blockchain
3. **No Third Party**: Không cần bên thứ ba để xác minh
4. **Decentralization**: Không phụ thuộc vào server trung tâm
5. **Verification**: Dễ dàng verify qua blockchain explorer

## 📝 License

UNLICENSED

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.
