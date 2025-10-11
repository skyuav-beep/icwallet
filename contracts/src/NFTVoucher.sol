// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/// @title NFTVoucher
/// @notice Placeholder template for ISC-based voucher NFTs until detailed specs are implemented.
/// @dev EN/KR documentation is required for all state variables and functions.
/// @dev 모든 상태 변수와 함수에는 영문/국문 주석을 추가해야 합니다.
contract NFTVoucher {
    /// @notice Emitted when a voucher definition is created. / 바우처 사양이 등록될 때 발생합니다.
    event VoucherDefined(uint256 indexed voucherId, address indexed issuer);

    /// @notice In-memory representation of a voucher series. / 바우처 시리즈를 나타내는 구조체.
    struct VoucherSpec {
        string name; // Voucher display name / 바우처 표시 이름
        string uri; // Metadata URI / 메타데이터 URI
        uint64 usableFrom; // Earliest usage timestamp / 사용 가능 시작 시각
        uint64 expiresAt; // Expiry timestamp / 만료 시각
        bool active; // Active flag / 활성화 여부
    }

    /// @dev Simple storage map for placeholder usage. / 예비 구현을 위한 단순 스토리지 맵.
    mapping(uint256 => VoucherSpec) private _voucherSpecs;

    /// @notice Register or update a voucher specification. / 바우처 사양을 등록하거나 갱신합니다.
    function upsertVoucherSpec(
        uint256 voucherId,
        VoucherSpec calldata spec
    ) external {
        _voucherSpecs[voucherId] = spec;
        emit VoucherDefined(voucherId, msg.sender);
    }

    /// @notice Fetch voucher metadata by id. / 식별자로 바우처 메타데이터를 조회합니다.
    function getVoucherSpec(
        uint256 voucherId
    ) external view returns (VoucherSpec memory) {
        return _voucherSpecs[voucherId];
    }
}
