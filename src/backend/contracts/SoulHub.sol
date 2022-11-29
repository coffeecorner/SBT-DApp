// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Soul.sol";

contract SoulHub is ReentrancyGuard {
    //state variables
    address payable public immutable feeAccount; //the account that receives fees
    uint public immutable fee; //the fee percentage on sales
    uint public soulCount;
    
    struct soulItem {
         uint soulId;
         Soul soul;
         address minter;
    }

    event CreatedSoul(
        uint soulId,
        address indexed soul,
        address indexed minter
    );


     //itemId -> Item
     mapping (uint => soulItem) public soulWallet;

    constructor(uint _fee){
        feeAccount = payable(msg.sender);
        fee = _fee;
    }

    function makeSoul(Soul _soul) external nonReentrant{

        //increment soulCount
        soulCount++;

        //add new item to items mapping
        soulWallet[soulCount] = soulItem (
            soulCount,
            _soul,
            msg.sender
        );

        //emit Offered event
        emit CreatedSoul(
            soulCount, 
            address(_soul),
            msg.sender
        );
    }

    function getSoulName(address _soulAddress) view public returns(string memory){
        Soul currentSoul = Soul(_soulAddress);
        return currentSoul.getSoulName();
    }

    function makeSBT(uint _soulId, IERC721 _sbt) public {

        soulItem memory soulitem = soulWallet[_soulId];
        address _soulAddress = address(soulitem.soul);
        soulitem.soul.mintSBT(_sbt, _soulAddress);

        transferGas();
    }

    function makeSBTFor(uint _soulId, IERC721 _sbt, address _mintee) public {
        
        soulItem memory soulitem = soulWallet[_soulId];
        address _soulAddress = address(soulitem.soul);
        soulitem.soul.mintSBTFor(_sbt, _mintee, _soulAddress);

        transferGas();

    }

    function transferGas() public payable {
        feeAccount.send(fee);
    }
}