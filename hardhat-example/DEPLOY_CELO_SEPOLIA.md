# 🚀 Hướng Dẫn Deploy Lên Celo Sepolia Testnet

Hướng dẫn chi tiết từng bước để deploy contract DiplomaVerification lên Celo Sepolia Testnet.

## ✅ Checklist Trước Khi Bắt Đầu

- [x] Đã có MetaMask cài đặt
- [x] Đã thêm Celo Sepolia Testnet vào MetaMask
- [x] Đã có số dư CELO trên testnet (tối thiểu 0.01 CELO)
- [ ] Đã biết private key của ví MetaMask

## 📋 Bước 1: Kiểm Tra Số Dư

1. Mở **MetaMask**
2. Chọn network **"Celo Sepolia Testnet"**
3. Kiểm tra số dư CELO (cần ít nhất **0.01 CELO** để deploy)

Nếu chưa có đủ CELO:
- Truy cập: https://faucet.celo.org/
- Nhập địa chỉ ví và request tokens

## 🔐 Bước 2: Lấy Private Key từ MetaMask

⚠️ **CẢNH BÁO**: Private key rất nhạy cảm! Chỉ dùng cho testnet, không bao giờ chia sẻ!

1. Mở **MetaMask**
2. Click vào **icon account** (góc trên bên phải) → Chọn account đang dùng
3. Click **"Account details"** hoặc **"Chi tiết tài khoản"**
4. Click **"Show private key"** hoặc **"Hiển thị khóa riêng"**
5. Nhập **password MetaMask**
6. **Copy private key** (bắt đầu bằng `0x`)

**Lưu ý**: Đảm bảo private key bắt đầu bằng `0x`. Nếu không có, thêm vào đầu.

## 📝 Bước 3: Tạo File .env

1. Trong thư mục `hardhat-example/`, tạo file mới tên `.env`
2. Thêm nội dung sau:

```env
CELO_PRIVATE_KEY=0xYourPrivateKeyHere
```

**Ví dụ**:
```env
CELO_PRIVATE_KEY=0x692471e3cd3b5e5c4d772b20d657c61db3aee9305e771962259c039b4f716b85
```

**Lưu ý**:
- Thay `0xYourPrivateKeyHere` bằng private key thật của bạn
- Đảm bảo có `0x` ở đầu
- File `.env` đã được thêm vào `.gitignore` (an toàn)

## 🔧 Bước 4: Kiểm Tra Cấu Hình

Kiểm tra file `hardhat.config.ts` đã có cấu hình `celoSepolia`:

```typescript
celoSepolia: {
  type: "http",
  chainType: "l1",
  url: process.env.CELO_SEPOLIA_RPC_URL || "https://rpc.ankr.com/celo_sepolia",
  accounts: ...,
  chainId: 11142220,
}
```

Nếu chưa có, cấu hình đã được thêm tự động.

## 🚀 Bước 5: Deploy Contract

Mở terminal trong thư mục `hardhat-example/` và chạy:

```bash
npx hardhat run scripts/deploy-celo.ts --network celoSepolia
```

### Kết Quả Mong Đợi

Bạn sẽ thấy output như sau:

```
🚀 Deploying DiplomaVerification to Celo...
Network: celoSepolia
Chain ID: 11142220
Deployer address: 0x...
Balance: 1.7830 CELO (testnet)

⏳ Deploying contract...

✅ Contract deployed successfully!
════════════════════════════════════════
📋 Deployment Information
════════════════════════════════════════
Contract Address: 0x1234...abcd
Network: celoSepolia
Chain ID: 11142220
Admin Address: 0x5678...efgh
Block Number: 12345678
Deployment Time: 1234 ms
Deployer Balance: 1.7800 CELO
Contract Admin: 0x5678...efgh
════════════════════════════════════════

💾 Deployment info saved to: deployments/deployment-celoSepolia-...
💾 Latest deployment info saved to: deployments/latest-celoSepolia.json

📝 Next Steps:
1. Save the contract address above
2. View on Celo Explorer:
   https://explorer.celo.org/sepolia/address/0x1234...abcd
3. Update CONTRACT_ADDRESS in your scripts
4. Add your first diploma:
   npx hardhat run scripts/add-diploma.ts --network celoSepolia

✨ Deployment completed!
```

## ✅ Bước 6: Xác Nhận Deployment

1. **Copy Contract Address** từ output
2. Truy cập **Celo Explorer**: 
   ```
   https://explorer.celo.org/sepolia/address/YOUR_CONTRACT_ADDRESS
   ```
3. Kiểm tra transaction và contract code

## 🎯 Bước 7: Thêm Bằng Cấp Đầu Tiên

Sau khi deploy thành công:

1. Mở file `scripts/add-diploma.ts`
2. Tìm dòng `CONTRACT_ADDRESS` và cập nhật:
   ```typescript
   const CONTRACT_ADDRESS = "0x1234...abcd"; // Địa chỉ contract vừa deploy
   ```
3. Cập nhật thông tin bằng cấp:
   ```typescript
   const STUDENT_ADDRESS = "0x..."; // Địa chỉ ví sinh viên
   const GRADES = [85, 90, 88, 92, 87]; // Điểm số
   ```
4. Chạy:
   ```bash
   npx hardhat run scripts/add-diploma.ts --network celoSepolia
   ```

## 🔍 Bước 8: Verify Bằng Cấp

1. Mở file `scripts/verify-diploma.ts`
2. Cập nhật:
   ```typescript
   const CONTRACT_ADDRESS = "0x1234...abcd";
   const DIPLOMA_HASH = "0x..."; // Hash từ bước add-diploma
   ```
3. Chạy:
   ```bash
   npx hardhat run scripts/verify-diploma.ts --network celoSepolia
   ```

## 🐛 Xử Lý Lỗi

### ❌ "No wallet found!"

**Nguyên nhân**: Private key chưa được set hoặc sai format

**Giải pháp**:
1. Kiểm tra file `.env` có tồn tại không
2. Đảm bảo private key bắt đầu bằng `0x`
3. Kiểm tra không có khoảng trắng thừa

### ❌ "Insufficient funds"

**Nguyên nhân**: Không đủ CELO để trả gas fee

**Giải pháp**:
1. Kiểm tra số dư trên MetaMask
2. Lấy thêm tokens từ faucet: https://faucet.celo.org/

### ❌ "Network connection error"

**Nguyên nhân**: RPC URL không truy cập được

**Giải pháp**:
1. Kiểm tra kết nối internet
2. Thử RPC khác (có thể set trong `.env`):
   ```env
   CELO_SEPOLIA_RPC_URL=https://your-preferred-rpc-url
   ```

### ❌ "Wrong network"

**Nguyên nhân**: MetaMask đang ở network khác

**Giải pháp**: Chuyển MetaMask sang "Celo Sepolia Testnet"

## 📚 Tài Liệu Tham Khảo

- **Celo Sepolia Explorer**: https://explorer.celo.org/sepolia
- **Celo Docs**: https://docs.celo.org
- **Celo Faucet**: https://faucet.celo.org/
- **Chain ID**: 11142220

## 💡 Tips

1. **Luôn lưu Contract Address**: Copy và lưu lại contract address sau khi deploy
2. **Check Explorer**: Luôn kiểm tra transaction trên explorer
3. **Test trước**: Test kỹ trên testnet trước khi deploy mainnet
4. **Backup private key**: Lưu private key ở nơi an toàn (chỉ cho testnet!)

## ✅ Hoàn Tất!

Chúc mừng! Bạn đã deploy thành công contract lên Celo Sepolia Testnet! 🎉

Bây giờ bạn có thể:
- Thêm bằng cấp vào contract
- Verify bằng cấp
- Tích hợp vào frontend
- Chia sẻ contract address cho người khác để verify

