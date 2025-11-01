# ⚡ Quick Start: Deploy lên Celo trong 5 phút

Hướng dẫn nhanh để deploy contract lên Celo Alfajores testnet.

## 🚀 3 Bước Nhanh

### Bước 1: Thêm Celo vào MetaMask (2 phút)

**Cách nhanh nhất**:
1. Truy cập: https://chainlist.org/
2. Tìm "Celo Alfajores" hoặc "Celo"
3. Click "Connect Wallet" → Chọn MetaMask
4. Click "Add to MetaMask"

**Hoặc thêm thủ công**:
- Network Name: `Celo Alfajores`
- RPC URL: `https://alfajores-forno.celo-testnet.org`
- Chain ID: `44787`
- Currency: `CELO`
- Explorer: `https://alfajores.celoscan.io`

### Bước 2: Lấy Testnet Tokens (1 phút)

1. Truy cập: https://faucet.celo.org/alfajores
2. Paste địa chỉ ví MetaMask
3. Click "Request Funds"
4. Đợi nhận tokens (~1 phút)

### Bước 3: Setup và Deploy (2 phút)

```bash
# 1. Set private key (lấy từ MetaMask: Account Details → Show Private Key)
npx hardhat keystore set CELO_PRIVATE_KEY

# 2. Deploy lên Alfajores testnet
npx hardhat run scripts/deploy-celo.ts --network alfajores
```

## ✅ Done!

Contract đã được deploy lên Celo! 

Copy **Contract Address** từ output để sử dụng.

## 📋 Xem Chi Tiết

Xem hướng dẫn đầy đủ trong: [CELO_SETUP.md](./CELO_SETUP.md)

## 🎯 Next Steps

1. Xem contract trên Celo Explorer:
   ```
   https://alfajores.celoscan.io/address/YOUR_CONTRACT_ADDRESS
   ```

2. Thêm bằng cấp đầu tiên:
   ```bash
   # Chỉnh CONTRACT_ADDRESS trong scripts/add-diploma.ts
   npx hardhat run scripts/add-diploma.ts --network alfajores
   ```

3. Verify bằng cấp:
   ```bash
   # Chỉnh CONTRACT_ADDRESS và DIPLOMA_HASH trong scripts/verify-diploma.ts
   npx hardhat run scripts/verify-diploma.ts --network alfajores
   ```

## 🐛 Gặp Lỗi?

- **"Insufficient funds"**: Lấy thêm tokens từ faucet
- **"Wrong network"**: Chuyển MetaMask sang Celo Alfajores
- **"Invalid private key"**: Đảm bảo private key bắt đầu bằng `0x`

Xem thêm: [CELO_SETUP.md](./CELO_SETUP.md) phần "Xử Lý Lỗi"

