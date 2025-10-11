// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script} from "forge-std/Script.sol";
import {NFTVoucher} from "../src/NFTVoucher.sol";

/// @title DeployNFTVoucher / NFTVoucher 배포 스크립트
/// @notice Minimal deployment script for the placeholder voucher contract. / 예비 바우처 컨트랙트 배포 스크립트.
contract DeployNFTVoucher is Script {
    function run() external returns (NFTVoucher deployed) {
        vm.startBroadcast();
        deployed = new NFTVoucher();
        vm.stopBroadcast();
    }
}
