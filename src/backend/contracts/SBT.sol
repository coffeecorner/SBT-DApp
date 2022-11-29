// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ERC5114URIStorage.sol";

contract SBT is ERC5114URIStorage {
    uint public tokenCount;  
    constructor() ERC5114("DApp SBT", "DAPP"){}

    function mint(string memory _tokenURI) external returns(uint){
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }
}
 