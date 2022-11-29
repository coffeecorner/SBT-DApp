// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Soul.sol";

contract SoulHub is ReentrancyGuard {
    //state variables
    address payable public immutable feeAccount; //the account that receives fees
    uint public immutable feePercent; //the fee percentage on sales
    uint public soulCount;
    
    struct soulItem {
         uint soulItemId;
         Soul soul;
         uint soulId;
         address minter;
    }

    event CreatedSoul(
        uint soulItemId, 
        address indexed soul,
        uint soulId,
        address indexed minter
    );


     //itemId -> Item
     mapping (uint => soulItem) public soulWallet;

    constructor(uint _feePercent){
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeSoul(Soul _soul, uint _soulId) external nonReentrant{
        //require(_price>0,"Price must be greater than zero");

        //increment soulCount
        soulCount++;

        //add new item to items mapping
        soulWallet[soulCount] = soulItem (
            soulCount,
            _soul,
            _soulId,
            msg.sender
        );

        //emit Offered event
        emit CreatedSoul(
            soulCount, 
            address(_soul),
            _soulId,
            msg.sender
        );
    }

    function getSoulName(address _soulAddress) view public returns(string memory){
        Soul currentSoul = Soul(_soulAddress);
        return currentSoul.getSoulName();
    }

}