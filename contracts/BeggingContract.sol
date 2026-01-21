// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BeggingContract {

  mapping(address =>uint256) public donations;
  address public owner;
  uint256 public totalDonations;

    modifier onlyOwner(){
        require(msg.sender == owner,"Only owner can call this function");
        _;
    }
    constructor(){
        owner = msg.sender;
    }
    /**
     * @dev 筹集合约余额
     */
    function donate() external payable{
        require(msg.value > 0,"Donation amount must be greater than 0");
        donations[msg.sender] += msg.value;
        totalDonations += msg.value;
    }

    /**
     * @dev 提取合约余额
     */
    function withdraw() external payable onlyOwner(){
        uint256 amount = address(this).balance;
        require(amount >0 ,"No funds to withdraw");
        (bool success,) = owner.call{value:amount}("");
        require(success,"Transfer failed");
    }
    /**
     * @dev 提取合约余额
     */
    function getDonation(address _address) external view returns(uint256){
        return donations[_address];
    }

     /**
     * @dev 获取合约余额
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}