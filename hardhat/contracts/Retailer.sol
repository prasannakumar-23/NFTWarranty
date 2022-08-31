//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract Retailer {
    mapping(address => bool) public whitelistedAddresses;
    uint8 public numAddressesWhitelisted;
    constructor(){
        whitelistedAddresses[msg.sender]=true;
    }
    function addAddressToWhitelist() public {     
        require(!whitelistedAddresses[msg.sender], "Sender has already been whitelisted");
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }

}