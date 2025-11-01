# 📘 Hướng Dẫn Deploy Contract DiplomaVerification

Hướng dẫn chi tiết để deploy smart contract lên local network và Sepolia testnet.

## 📋 Chuẩn Bị

### 1. Kiểm tra môi trường

Đảm bảo đã cài đặt:
```bash
node --version  # Cần >= 18
npm --version
```

### 2. Cài đặt dependencies (nếu chưa)

```bash
cd hardhat-example
npm install
```

### 3. Compile contract

```bash
npx hardhat compile
```

Nếu thành công, bạn sẽ thấy thư mục `artifacts/` được tạo ra.

---

## 🚀 Phương Pháp 1: Deploy Lên Local Network (Dễ Nhất)

### Bước 1: Chạy Hardhat Local Network

Mở terminal thứ nhất:
```bash
npx hardhat node
```

Giữ terminal này chạy. Bạn sẽ thấy danh sách 20 accounts với private keys và ETH.

### Bước 2: Deploy Contract (Terminal mới)

Mở terminal thứ hai và chạy một trong các cách sau:

**Cách A: Sử dụng Ignition (Khuyến nghị)**
```bash
npx hardhat ignition deploy ignition/modules/DiplomaVerification.ts --network hardhatMainnet
```

**Cách B: Sử dụng Script**
```bash
npx hardhat run scripts/deploy-diploma.ts --network hardhatMainnet
```

**Cách C: Demo tự động (tất cả trong một)**
```bash
npx hardhat run scripts/interactive-example.ts --network hardhatMainnet
```

### Bước 3: Lưu thông tin

Sau khi deploy, bạn sẽ nhận được:
- **Contract Address**: Địa chỉ contract trên blockchain
- **Transaction Hash**: Hash của transaction deploy
- **Admin Address**: Địa chỉ admin (người deploy)

⚠️ **Lưu ý**: Contract chỉ tồn tại trên local network này. Khi dừng `hardhat node`, mọi thứ sẽ mất.

---

## 🌐 Phương Pháp 2: Deploy Lên Sepolia Testnet (Mạng Thật)

### Bước 1: Chuẩn bị tài khoản

1. **Tạo ví MetaMask** (nếu chưa có)
   - Cài MetaMask extension
   - Tạo ví mới hoặc import ví có sẵn

2. **Lấy Sepolia ETH** (testnet ETH, miễn phí)
   - Truy cập: https://sepoliafaucet.com/
   - Hoặc: https://faucet.quicknode.com/ethereum/sepolia
   - Nhập địa chỉ ví và yêu cầu ETH
   - Đợi vài phút để nhận ETH

3. **Kiểm tra số dư Sepolia**
   - Trong MetaMask, chuyển network sang Sepolia
   - Kiểm tra số dư (cần ít nhất 0.01 ETH để deploy)

### Bước 2: Lấy RPC URL

Bạn cần một RPC endpoint cho Sepolia. Có thể dùng:

**Option 1: Infura (Miễn phí)**
1. Đăng ký tại: https://infura.io/
2. Tạo project mới
3. Copy "Sepolia" endpoint URL
   - Format: `https://sepolia.infura.io/v3/YOUR_API_KEY`

**Option 2: Alchemy (Miễn phí)**
1. Đăng ký tại: https://www.alchemy.com/
2. Tạo app mới, chọn "Ethereum" và "Sepolia"
3. Copy HTTP URL

**Option 3: Public RPC (Không ổn định)**
```
https://rpc.sepolia.org
```

### Bước 3: Cấu hình Hardhat

Có 2 cách để set private key:

**Cách 1: Sử dụng Hardhat Keystore (Khuyến nghị - An toàn hơn)**

```bash
# Set private key (sẽ được mã hóa và lưu an toàn)
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

Khi được hỏi, paste private key của bạn (từ MetaMask: Account → Details → Export Private Key).

**Cách 2: Environment Variable**

Tạo file `.env` trong thư mục `hardhat-example/`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
SEPOLIA_PRIVATE_KEY=your_private_key_here
```

⚠️ **QUAN TRỌNG**: 
- **KHÔNG BAO GIỜ** commit file `.env` lên Git
- File `.env` đã được thêm vào `.gitignore`
- Chỉ dùng private key của testnet, không dùng mainnet!

### Bước 4: Cập nhật hardhat.config.ts

Kiểm tra file `hardhat.config.ts` đã có cấu hình Sepolia chưa. Nếu chưa, thêm:

```typescript
sepolia: {
  type: "http",
  chainType: "l1",
  url: configVariable("SEPOLIA_RPC_URL"),
  accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
},
```

### Bước 5: Deploy lên Sepolia

```bash
# Sử dụng Ignition
npx hardhat ignition deploy ignition/modules/DiplomaVerification.ts --network sepolia

# Hoặc sử dụng script
npx hardhat run scripts/deploy-diploma.ts --network sepolia
```

### Bước 6: Xác nhận trên Block Explorer

1. Copy **Contract Address** từ output
2. Truy cập: https://sepolia.etherscan.io/
3. Paste địa chỉ và tìm kiếm
4. Bạn sẽ thấy:
   - Contract đã được deploy
   - Transaction hash
   - Code (nếu đã verify)

---

## 🔍 Kiểm Tra Sau Khi Deploy

### 1. Verify Contract Hoạt Động

Sau khi deploy, bạn có thể kiểm tra:

```bash
# Chạy interactive example (nếu deploy local)
npx hardhat run scripts/interactive-example.ts --network hardhatMainnet
```

### 2. Thêm Bằng Cấp Test

Chỉnh sửa `scripts/add-diploma.ts`:
- Set `CONTRACT_ADDRESS` = địa chỉ contract vừa deploy
- Set `STUDENT_ADDRESS` = địa chỉ ví sinh viên
- Cấu hình thông tin bằng cấp

Chạy:
```bash
npx hardhat run scripts/add-diploma.ts --network <network>
```

### 3. Verify Bằng Cấp

Chỉnh sửa `scripts/verify-diploma.ts`:
- Set `CONTRACT_ADDRESS`
- Set `DIPLOMA_HASH` (lấy từ bước add-diploma)

Chạy:
```bash
npx hardhat run scripts/verify-diploma.ts --network <network>
```

---

## 📝 Checklist Deploy

### Trước khi deploy:
- [ ] Đã compile contract thành công (`npx hardhat compile`)
- [ ] Đã test contract (`npx hardhat test`)
- [ ] Đã chuẩn bị RPC URL (nếu deploy testnet)
- [ ] Đã set private key (nếu deploy testnet)
- [ ] Đã có đủ ETH/Gas (nếu deploy testnet)

### Sau khi deploy:
- [ ] Đã lưu Contract Address
- [ ] Đã lưu Transaction Hash
- [ ] Đã lưu Admin Address
- [ ] Đã kiểm tra trên block explorer (nếu testnet)
- [ ] Đã test thêm và verify bằng cấp

---

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: "Insufficient funds"
**Nguyên nhân**: Không đủ ETH để trả gas fee
**Giải pháp**: 
- Nạp thêm Sepolia ETH từ faucet
- Giảm gas limit trong config (không khuyến nghị)

### Lỗi: "Network connection error"
**Nguyên nhân**: RPC URL sai hoặc không truy cập được
**Giải pháp**:
- Kiểm tra RPC URL có đúng không
- Thử RPC khác (Alchemy thay vì Infura)
- Kiểm tra kết nối internet

### Lỗi: "Invalid private key"
**Nguyên nhân**: Private key sai format hoặc không đúng
**Giải pháp**:
- Đảm bảo private key bắt đầu bằng `0x`
- Kiểm tra lại private key từ MetaMask
- Sử dụng `npx hardhat keystore set` thay vì env var

### Lỗi: "Contract already deployed"
**Nguyên nhân**: Đã deploy trước đó với cùng config
**Giải pháp**:
- Không sao, chỉ cần dùng contract address cũ
- Hoặc deploy lại với network khác

---

## 💡 Tips & Best Practices

1. **Luôn test trên local trước**: Deploy local network trước khi deploy testnet
2. **Lưu thông tin deploy**: Tạo file `deployment-info.json` để lưu:
   ```json
   {
     "network": "sepolia",
     "contractAddress": "0x...",
     "adminAddress": "0x...",
     "txHash": "0x...",
     "blockNumber": 12345678,
     "deployDate": "2024-11-01"
   }
   ```
3. **Verify contract**: Sau khi deploy lên testnet, nên verify contract trên Etherscan để mọi người có thể xem code
4. **Giữ private key an toàn**: Không share, không commit lên Git
5. **Test kỹ trước khi mainnet**: Luôn test đầy đủ trên testnet trước

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra lại các bước trong hướng dẫn
2. Xem phần "Xử Lý Lỗi" ở trên
3. Kiểm tra Hardhat docs: https://hardhat.org/docs
4. Kiểm tra logs và error messages cẩn thận

---

## 🎯 Next Steps

Sau khi deploy thành công:
1. ✅ Thêm bằng cấp đầu tiên
2. ✅ Test verify function
3. ✅ Tích hợp vào frontend (nếu có)
4. ✅ Xây dựng UI cho users
5. ✅ Deploy lên mainnet (khi đã test kỹ)

Chúc bạn deploy thành công! 🚀

