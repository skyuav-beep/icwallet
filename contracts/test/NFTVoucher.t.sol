// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {NFTVoucher} from "../src/NFTVoucher.sol";

/// @title NFTVoucherTest / NFTVoucher 테스트
/// @notice Sanity checks for placeholder voucher storage logic. / 예비 바우처 스토리지 로직에 대한 간단한 검증.
contract NFTVoucherTest is Test {
    NFTVoucher private voucher;

    function setUp() public {
        voucher = new NFTVoucher();
    }

    function testUpsertAndGetVoucherSpec() public {
        NFTVoucher.VoucherSpec memory spec = NFTVoucher.VoucherSpec({
            name: "Trial Voucher",
            uri: "ipfs://example",
            usableFrom: uint64(block.timestamp),
            expiresAt: uint64(block.timestamp + 7 days),
            active: true
        });

        voucher.upsertVoucherSpec(1, spec);
        NFTVoucher.VoucherSpec memory stored = voucher.getVoucherSpec(1);

        assertEq(stored.name, spec.name);
        assertEq(stored.uri, spec.uri);
        assertEq(stored.usableFrom, spec.usableFrom);
        assertEq(stored.expiresAt, spec.expiresAt);
        assertEq(stored.active, spec.active);
    }
}
