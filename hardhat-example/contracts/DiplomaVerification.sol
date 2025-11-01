// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title DiplomaVerification
 * @dev Smart contract để xác minh bằng cấp đại học trên blockchain
 * @notice Lưu trữ hash của bằng cấp để đảm bảo tính bảo mật và không thể thay đổi
 */
contract DiplomaVerification {
    // Admin address - chỉ đại học mới có thể cấp bằng
    address public admin;
    
    // Struct để lưu trữ thông tin bằng cấp
    struct Diploma {
        bytes32 diplomaHash;      // Hash của PDF bằng cấp + thông tin
        address studentAddress;   // Địa chỉ ví của sinh viên
        uint256 issueDate;        // Ngày cấp bằng (timestamp)
        uint256[] grades;         // Mảng điểm số các môn học
        bool exists;              // Kiểm tra bằng cấp có tồn tại không
    }
    
    // Mapping từ hash -> thông tin bằng cấp
    mapping(bytes32 => Diploma) public diplomas;
    
    // Mapping để theo dõi các bằng cấp của mỗi sinh viên
    mapping(address => bytes32[]) public studentDiplomas;
    
    // Mảng lưu tất cả các hash bằng cấp đã được cấp
    bytes32[] public allDiplomaHashes;
    
    // Events
    event DiplomaIssued(
        bytes32 indexed diplomaHash,
        address indexed studentAddress,
        uint256 issueDate,
        uint256[] grades
    );
    
    event AdminChanged(
        address indexed oldAdmin,
        address indexed newAdmin
    );
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "DiplomaVerification: Only admin can perform this action");
        _;
    }
    
    /**
     * @dev Constructor - khởi tạo admin là người deploy contract
     */
    constructor() {
        admin = msg.sender;
    }
    
    /**
     * @dev Thay đổi admin (chỉ admin hiện tại mới có thể)
     * @param newAdmin Địa chỉ admin mới
     */
    function changeAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "DiplomaVerification: New admin cannot be zero address");
        address oldAdmin = admin;
        admin = newAdmin;
        emit AdminChanged(oldAdmin, newAdmin);
    }
    
    /**
     * @dev Cấp bằng cấp mới (chỉ admin - đại học)
     * @param diplomaHash Hash của PDF bằng cấp + thông tin (để bảo mật dữ liệu cá nhân)
     * @param studentAddress Địa chỉ ví của sinh viên
     * @param grades Mảng điểm số các môn học
     * @notice Hash nên được tính từ: keccak256(abi.encodePacked(pdfHash, studentId, graduationDate, ...))
     */
    function addDiploma(
        bytes32 diplomaHash,
        address studentAddress,
        uint256[] memory grades
    ) external onlyAdmin {
        require(diplomaHash != bytes32(0), "DiplomaVerification: Diploma hash cannot be zero");
        require(studentAddress != address(0), "DiplomaVerification: Student address cannot be zero");
        require(!diplomas[diplomaHash].exists, "DiplomaVerification: Diploma already exists");
        
        diplomas[diplomaHash] = Diploma({
            diplomaHash: diplomaHash,
            studentAddress: studentAddress,
            issueDate: block.timestamp,
            grades: grades,
            exists: true
        });
        
        studentDiplomas[studentAddress].push(diplomaHash);
        allDiplomaHashes.push(diplomaHash);
        
        emit DiplomaIssued(diplomaHash, studentAddress, block.timestamp, grades);
    }
    
    /**
     * @dev Xác minh bằng cấp bằng hash (public - ai cũng có thể verify)
     * @param diplomaHash Hash của bằng cấp cần xác minh
     * @return exists Trả về true nếu bằng cấp tồn tại và hợp lệ
     * @return studentAddress Địa chỉ của sinh viên sở hữu bằng cấp
     * @return issueDate Ngày cấp bằng
     * @return grades Mảng điểm số
     */
    function verify(bytes32 diplomaHash) 
        external 
        view 
        returns (
            bool exists,
            address studentAddress,
            uint256 issueDate,
            uint256[] memory grades
        ) 
    {
        Diploma memory diploma = diplomas[diplomaHash];
        return (
            diploma.exists,
            diploma.studentAddress,
            diploma.issueDate,
            diploma.grades
        );
    }
    
    /**
     * @dev Lấy thông tin chi tiết của bằng cấp
     * @param diplomaHash Hash của bằng cấp
     * @return Diploma struct với đầy đủ thông tin
     */
    function getDiploma(bytes32 diplomaHash) 
        external 
        view 
        returns (Diploma memory) 
    {
        require(diplomas[diplomaHash].exists, "DiplomaVerification: Diploma does not exist");
        return diplomas[diplomaHash];
    }
    
    /**
     * @dev Lấy danh sách các bằng cấp của một sinh viên
     * @param studentAddress Địa chỉ ví của sinh viên
     * @return Array các hash bằng cấp của sinh viên
     */
    function getStudentDiplomas(address studentAddress) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return studentDiplomas[studentAddress];
    }
    
    /**
     * @dev Lấy tổng số bằng cấp đã được cấp
     * @return Số lượng bằng cấp
     */
    function getTotalDiplomas() external view returns (uint256) {
        return allDiplomaHashes.length;
    }
    
    /**
     * @dev Lấy tất cả các hash bằng cấp (có thể tốn gas nếu có nhiều bằng cấp)
     * @return Array tất cả các hash bằng cấp
     */
    function getAllDiplomaHashes() external view returns (bytes32[] memory) {
        return allDiplomaHashes;
    }
}

