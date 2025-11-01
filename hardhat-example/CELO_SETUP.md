# 🌍 Hướng Dẫn Deploy Lên Celo Network với MetaMask

Hướng dẫn chi tiết để deploy contract lên Celo blockchain sử dụng MetaMask.

## 📋 Tổng Quan về Celo

- **Celo Alfajores** (Testnet): Chain ID `44787` - Dùng để test, token miễn phí
- **Celo Mainnet**: Chain ID `42220` - Network chính thức, cần CELO thật

## 🔧 Bước 1: Thêm Celo vào MetaMask

### Cách 1: Thêm Tự Động (Dễ nhất)

1. Truy cập: https://docs.celo.org/getting-started/wallets/using-metamask-with-celo/metamask-setup
2. Hoặc truy cập: https://chainlist.org/
3. Tìm "Celo" hoặc "Alfajores"
4. Click "Connect Wallet" → Chọn MetaMask
5. Click "Add to MetaMask"

### Cách 2: Thêm Thủ Công

#### Thêm Celo Alfajores (Testnet):

1. Mở MetaMask
2. Click vào network dropdown (phía trên)
3. Click "Add Network" → "Add a network manually"
4. Điền thông tin:
   - **Network Name**: `Celo Alfajores`
   - **RPC URL**: `https://alfajores-forno.celo-testnet.org`
   - **Chain ID**: `44787`
   - **Currency Symbol**: `CELO` hoặc `cGLD`
   - **Block Explorer URL**: `https://alfajores.celoscan.io`

5. Click "Save"

#### Thêm Celo Mainnet:

1. Mở MetaMask
2. Click "Add Network" → "Add a network manually"
3. Điền thông tin:
   - **Network Name**: `Celo Mainnet`
   - **RPC URL**: `https://forno.celo.org`
   - **Chain ID**: `42220`
   - **Currency Symbol**: `CELO`
   - **Block Explorer URL**: `https://celoscan.io`

4. Click "Save"

## 💰 Bước 2: Lấy Testnet Tokens (Chỉ cho Alfajores)

### Cách 1: Celo Faucet (Khuyến nghị)

1. Truy cập: https://faucet.celo.org/alfajores
2. Nhập địa chỉ ví MetaMask của bạn
3. Chọn loại token (CELO, cUSD, cEUR)
4. Click "Request Funds"
5. Đợi vài phút để nhận tokens

### Cách 2: Discord Faucet

1. Tham gia Discord Celo: https://discord.gg/celo
2. Vào channel `#alfajores-faucet`
3. Gửi lệnh: `/faucet <your-wallet-address>`
4. Đợi nhận tokens

### Kiểm Tra Số Dư

- Trong MetaMask, chuyển network sang "Celo Alfajores"
- Kiểm tra số dư (cần ít nhất 0.1 CELO để deploy)

## 🔐 Bước 3: Lấy Private Key từ MetaMask

⚠️ **CẢNH BÁO**: Private key rất nhạy cảm! Chỉ dùng cho testnet, không bao giờ chia sẻ!

1. Mở MetaMask
2. Click vào icon account (góc trên bên phải)
3. Chọn "Account details"
4. Click "Show private key"
5. Nhập password MetaMask
6. Copy private key (bắt đầu bằng `0x`)

## ⚙️ Bước 4: Cấu Hình Hardhat

### Set Private Key

```bash
# Sử dụng Hardhat Keystore (Khuyến nghị - An toàn hơn)
npx hardhat keystore set CELO_PRIVATE_KEY
```

Khi được hỏi, paste private key bạn vừa copy.

### Hoặc sử dụng Environment Variable

Tạo file `.env` (nếu chưa có):

```env
CELO_PRIVATE_KEY=your_private_key_here

# Optional: Nếu muốn dùng custom RPC
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
CELO_RPC_URL=https://forno.celo.org
```

## 🚀 Bước 5: Deploy Contract

### Deploy lên Alfajores Testnet (Khuyến nghị cho test)

```bash
npx hardhat run scripts/deploy-celo.ts --network alfajores
```

### Deploy lên Celo Mainnet (Sau khi test xong)

```bash
# Đảm bảo bạn đã test kỹ trên testnet!
npx hardhat run scripts/deploy-celo.ts --network celo
```

## ✅ Bước 6: Kiểm Tra Deployment

Sau khi deploy thành công:

1. **Copy Contract Address** từ output
2. **Kiểm tra trên Celo Explorer**:
   - Alfajores: https://alfajores.celoscan.io
   - Mainnet: https://celoscan.io
3. Paste contract address vào explorer để xem transaction

## 📝 Ví Dụ Output

```
✅ Contract deployed successfully!
════════════════════════════════════════
📋 Deployment Information
════════════════════════════════════════
Contract Address: 0x1234...abcd
Network: alfajores
Chain ID: 44787
Admin Address: 0x5678...efgh
Block Number: 12345678
...
════════════════════════════════════════

🔍 View on Celo Explorer:
   https://alfajores.celoscan.io/address/0x1234...abcd
```

## 🎯 Bước 7: Thêm Bằng Cấp Đầu Tiên

Sau khi deploy, thêm bằng cấp:

1. Chỉnh sửa `scripts/add-diploma.ts`:
   - Set `CONTRACT_ADDRESS` = địa chỉ contract vừa deploy
   - Set `STUDENT_ADDRESS` = địa chỉ ví sinh viên
   - Cấu hình thông tin bằng cấp

2. Chạy:
```bash
npx hardhat run scripts/add-diploma.ts --network alfajores
```

## 🔍 Verify Bằng Cấp

1. Chỉnh sửa `scripts/verify-diploma.ts`
2. Set `CONTRACT_ADDRESS` và `DIPLOMA_HASH`
3. Chạy:
```bash
npx hardhat run scripts/verify-diploma.ts --network alfajores
```

## ⚠️ Lưu Ý Quan Trọng

1. **Luôn test trên Alfajores trước** trước khi deploy mainnet
2. **Giữ private key an toàn** - không bao giờ commit lên Git
3. **Kiểm tra gas fees** - Celo thường có gas fees thấp hơn Ethereum
4. **Backup contract address** - Lưu lại để sử dụng sau

## 🐛 Xử Lý Lỗi

### Lỗi: "Insufficient funds"
- **Nguyên nhân**: Không đủ CELO để trả gas
- **Giải pháp**: Lấy thêm từ faucet (Alfajores) hoặc mua CELO (mainnet)

### Lỗi: "Network connection error"
- **Nguyên nhân**: RPC URL không truy cập được
- **Giải pháp**: 
  - Kiểm tra kết nối internet
  - Thử RPC khác (Infura, QuickNode cung cấp Celo RPC)

### Lỗi: "Wrong network"
- **Nguyên nhân**: MetaMask đang ở network khác
- **Giải pháp**: Chuyển MetaMask sang Celo Alfajores/Celo Mainnet

## 📚 Tài Liệu Tham Khảo

- Celo Docs: https://docs.celo.org
- Celo Explorer: https://celoscan.io
- Celo Faucet: https://faucet.celo.org
- Chainlist: https://chainlist.org

## 🎉 Hoàn Tất!

Bạn đã setup xong Celo và sẵn sàng deploy! Chúc bạn thành công! 🚀

