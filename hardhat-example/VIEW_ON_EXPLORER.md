# 🔍 Hướng Dẫn Xem Thông Tin Trên Blockchain Explorer

Hướng dẫn chi tiết cách xem contract và bằng cấp trên Celo Explorer.

## 📋 Thông Tin Contract

- **Contract Address**: `0xfdaa553d5652f6f481b1c65b4c9f8bdb65ea6403`
- **Network**: Celo Sepolia Testnet
- **Explorer**: https://explorer.celo.org/sepolia

## 🔍 Cách 1: Xem Contract

### Bước 1: Truy cập Celo Explorer

Truy cập link sau:
```
https://explorer.celo.org/sepolia/address/0xfdaa553d5652f6f481b1c65b4c9f8bdb65ea6403
```

### Bước 2: Xem Thông Tin Contract

Trên trang explorer, bạn sẽ thấy:

1. **Contract Overview**:
   - Địa chỉ contract
   - Số dư
   - Code (bytecode đã deploy)

2. **Transactions Tab**:
   - Tất cả các giao dịch liên quan đến contract
   - Transaction deploy contract
   - Transaction thêm bằng cấp (addDiploma)

3. **Events Tab**:
   - Event `DiplomaIssued` khi có bằng cấp được thêm
   - Event `AdminChanged` nếu có thay đổi admin

4. **Contract Tab** (nếu đã verify):
   - Source code của contract
   - Có thể đọc và gọi functions

## 🔍 Cách 2: Xem Transaction Thêm Bằng Cấp

### Transaction Hash Đã Thêm

```
0x0e9e90fa73c93bce834c647dc37036c4c4a8353d0b517f0eb5c16ae99a319812
```

### Xem Transaction:

Truy cập:
```
https://explorer.celo.org/sepolia/tx/0x0e9e90fa73c93bce834c647dc37036c4c4a8353d0b517f0eb5c16ae99a319812
```

Trên trang transaction, bạn sẽ thấy:

1. **Transaction Details**:
   - Status: Success ✅
   - Block: 8698949
   - From: Admin address
   - To: Contract address
   - Gas used

2. **Event Logs**:
   - Click vào **"Logs"** tab
   - Tìm event `DiplomaIssued`
   - Xem thông tin:
     - `diplomaHash`: Hash của bằng cấp
     - `studentAddress`: Địa chỉ sinh viên
     - `issueDate`: Timestamp ngày cấp
     - `grades`: Mảng điểm số

3. **Input Data**:
   - Xem parameters được gửi vào function `addDiploma`

## 🔍 Cách 3: Xem Thông Tin Bằng Cấp (Read Contract)

### Trên Celo Explorer:

1. Truy cập contract address
2. Click tab **"Contract"** hoặc **"Read Contract"**
3. Nếu contract đã được verify, bạn có thể:
   - Gọi function `verify(diplomaHash)` để xem thông tin
   - Gọi function `getDiploma(diplomaHash)` để xem chi tiết
   - Gọi function `getStudentDiplomas(studentAddress)` để xem tất cả bằng cấp của sinh viên
   - Gọi function `getTotalDiplomas()` để xem tổng số bằng cấp

### Ví dụ Read Function:

**Function**: `verify`
**Parameter**: 
```
0x74f95bb1083038385aba24db428cf14449861111872ea9e0e7c5dd553bc710d5
```

Kết quả sẽ trả về:
- `exists`: true
- `studentAddress`: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
- `issueDate`: timestamp
- `grades`: [85, 90, 88, 92, 87, 89]

## 📊 Cách 4: Xem Tất Cả Events

### Filter Events:

1. Trên contract page, click **"Events"** tab
2. Filter theo event `DiplomaIssued`
3. Xem tất cả các bằng cấp đã được cấp

### Hoặc dùng API:

```bash
# Lấy tất cả events DiplomaIssued
curl "https://explorer.celo.org/sepolia/api?module=logs&action=getLogs&address=0xfdaa553d5652f6f481b1c65b4c9f8bdb65ea6403&topic0=0x..."
```

## 🔗 Links Nhanh

### Contract:
```
https://explorer.celo.org/sepolia/address/0xfdaa553d5652f6f481b1c65b4c9f8bdb65ea6403
```

### Transaction Deploy:
```
https://explorer.celo.org/sepolia/tx/[DEPLOY_TX_HASH]
```

### Transaction Add Diploma:
```
https://explorer.celo.org/sepolia/tx/0x0e9e90fa73c93bce834c647dc37036c4c4a8353d0b517f0eb5c16ae99a319812
```

### Student Address:
```
https://explorer.celo.org/sepolia/address/0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

## 💡 Tips

1. **Verify Contract**: Để đọc được code và gọi functions dễ dàng hơn, nên verify contract trên explorer
2. **Event Logs**: Events là cách tốt nhất để xem lịch sử tất cả bằng cấp đã được cấp
3. **Bookmark**: Lưu lại các links quan trọng để truy cập nhanh sau này

## 📱 Xem Trên Mobile

Celo Explorer có mobile-friendly, bạn có thể truy cập trên điện thoại:
- Mở trình duyệt mobile
- Truy cập: https://explorer.celo.org/sepolia
- Tìm kiếm contract address hoặc transaction hash

## 🎯 Tóm Tắt

1. **Xem Contract**: Truy cập contract address trên explorer
2. **Xem Transactions**: Click vào transaction để xem chi tiết
3. **Xem Events**: Xem logs để thấy tất cả bằng cấp đã được cấp
4. **Read Functions**: Nếu contract verified, có thể gọi functions trực tiếp

---

✨ Bây giờ bạn đã biết cách xem thông tin trên blockchain explorer rồi!

