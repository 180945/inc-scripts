// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface ITransparentProxy {

    function upgradeTo(address newImplementation) external;

    function upgradeToAndCall(address newImplementation, bytes memory data) external payable;

    function admin() external view returns (address);

    function implementation() external view returns (address);

    function changeAdmin(address newAdmin) external;

}
