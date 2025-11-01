/**
 * Script hướng dẫn deploy từng bước
 * Chạy script này để được hướng dẫn chi tiết
 * 
 * Usage: npx hardhat run scripts/guide-deploy.ts
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║     🎓 HƯỚNG DẪN DEPLOY CONTRACT DIPLOMA VERIFICATION        ║
╚══════════════════════════════════════════════════════════════╝

📘 Bạn muốn deploy lên mạng nào?

1️⃣  LOCAL NETWORK (Dễ nhất - Khuyến nghị cho người mới bắt đầu)
   ✅ Không cần cấu hình gì
   ✅ Nhanh, miễn phí
   ✅ Phù hợp để test
   ❌ Dữ liệu sẽ mất khi tắt hardhat node

2️⃣  SEPOLIA TESTNET (Mạng thật để test)
   ✅ Test trên mạng blockchain thật
   ✅ Có thể xem trên Etherscan
   ✅ Phù hợp để demo cho người khác
   ❌ Cần Sepolia ETH (miễn phí từ faucet)
   ❌ Cần cấu hình RPC URL

═══════════════════════════════════════════════════════════════

🚀 CÁCH 1: DEPLOY LOCAL NETWORK (Dễ nhất)

Bước 1: Mở terminal thứ nhất và chạy:
   npx hardhat node

Bước 2: Giữ terminal đó chạy, mở terminal thứ hai và chạy:
   npx hardhat run scripts/deploy-with-info.ts --network hardhatMainnet

Hoặc demo tự động (deploy + add diploma + verify):
   npx hardhat run scripts/interactive-example.ts --network hardhatMainnet

═══════════════════════════════════════════════════════════════

🌐 CÁCH 2: DEPLOY SEPOLIA TESTNET

Bước 1: Chuẩn bị Sepolia ETH
   → Truy cập: https://sepoliafaucet.com/
   → Nhập địa chỉ ví MetaMask (network Sepolia)
   → Yêu cầu ETH (miễn phí)

Bước 2: Lấy RPC URL
   → Option A: Tạo tài khoản tại https://infura.io/
   → Option B: Tạo tài khoản tại https://www.alchemy.com/
   → Copy RPC URL cho Sepolia

Bước 3: Set Private Key
   → Cách 1 (Khuyến nghị): npx hardhat keystore set SEPOLIA_PRIVATE_KEY
   → Cách 2: Tạo file .env với SEPOLIA_PRIVATE_KEY và SEPOLIA_RPC_URL

Bước 4: Deploy
   npx hardhat run scripts/deploy-with-info.ts --network sepolia

═══════════════════════════════════════════════════════════════

📚 TÀI LIỆU CHI TIẾT:

• Hướng dẫn đầy đủ: Xem file DEPLOY_GUIDE.md
• Quick Start: Xem file QUICK_START.md
• README chính: Xem file README.md

═══════════════════════════════════════════════════════════════

💡 LỜI KHUYÊN:

1. Luôn test trên local network trước
2. Sau khi deploy, lưu Contract Address
3. Test thêm bằng cấp và verify trước khi dùng thật
4. Đọc kỹ DEPLOY_GUIDE.md nếu gặp lỗi

═══════════════════════════════════════════════════════════════

✨ Chúc bạn deploy thành công!

`);

// Export để có thể import nếu cần
export {};

