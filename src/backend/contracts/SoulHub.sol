// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Soul.sol";

contract SoulHub is ReentrancyGuard {
    //state variables
    address payable public immutable feeAccount; //the account that receives fees
    uint public immutable fee; //the fee percentage on sales
    uint public soulItemCount;
    uint public sbtItemCount;
    
    //Item and event for Soul Item
    struct SoulItem {
         uint soulId;
         Soul soul;
         address minter;
    }

    event CreatedSoul(
        uint soulId,
        address indexed soul,
        address minter
    );

    //Item and events for SBT Item
    struct SBTItem {
         uint tokenId;
         IERC721 sbt;
         uint soulItemId;
         address payable minter;
    }

    event Offered(
        uint sbtId,
        address indexed sbt,
        uint sbtItemId,
        uint soulId,
        address minter
    );

    event Received(
        uint sbtId,
        address indexed sbt,
        uint sbtItemId,
        uint soulId,
        address minter,
        address mintee
    );


     //soulId -> soulItems
    mapping (uint => SoulItem) public _soulItems;

    //sbtId -> sbtItems
    mapping(uint => SBTItem) public _sbtItems;

    //soulId -> sbtCount
    mapping(uint => uint) public _soulContentCount;

    constructor(uint _fee){
        feeAccount = payable(msg.sender);
        fee = _fee;
    }

    //application functions
    function getBalance() public view returns(uint) {
        return msg.sender.balance; 
    }

    function transferGas() public payable {
        feeAccount.send(fee);
    }

    //SBT operations
    function createSBTItem(IERC721 _sbt, uint _sbtId, uint _soulId) public nonReentrant{
        //require the sbtId and sbtItemCount to line up
        require(_sbtId == sbtItemCount+1, "Invalid SBT Id number");

        //increment sbt item count
        sbtItemCount++;

        //add new sbtItem to items mapping
        _sbtItems[sbtItemCount] = SBTItem (
            _sbtId,
            _sbt,
            sbtItemCount,
            payable(msg.sender)
        );

        //increase soul content count
        _soulContentCount[_soulId] += 1;

        emit Offered(
            _sbtId,
            address(_sbt),
            sbtItemCount,
            _soulId,
            msg.sender
        );

        transferGas();
    } 

    function createSBTItemFor(IERC721 _sbt, uint _sbtId, uint _soulId, address _mintee) public nonReentrant{
        //require the sbtId and sbtItemCount to line up
        require(_sbtId == sbtItemCount+1, "Invalid SBT Id number");

        //increment sbt item count
        sbtItemCount++;

        //add new sbtItem to items mapping
        _sbtItems[sbtItemCount] = SBTItem (
            _sbtId,
            _sbt,
            sbtItemCount,
            payable(msg.sender)
        );

        //increase soul content count
        _soulContentCount[_soulId] += 1;

        //transfer sbt
        _sbt.transferFrom(msg.sender, _mintee, _sbtId);

        emit Offered(
            _sbtId,
            address(_sbt),
            sbtItemCount,
            _soulId,
            msg.sender
        );

        emit Received(
            _sbtId,
            address(_sbt),
            sbtItemCount,
            _soulId,
            msg.sender,
            _mintee            
        );

        transferGas();
    }

    //Soul Operations
    function createSoulItem(Soul _soul, uint _soulId) public nonReentrant{
        //require the soul Item ID and soul 
        require(_soulId == soulItemCount+1, "Invalid Soul ID number");
        
        //increment soul Item count
        soulItemCount++;

        //add new soul to soul Items mapping
        _soulItems[soulItemCount] = SoulItem (
            _soulId,
            _soul,
            msg.sender
        );

        //emit SoulCreated event
        emit CreatedSoul (
            _soulId,
            address(_soul),
            msg.sender           
        );

        transferGas();
    } 

    function getSoulContentCount(uint _soulId) public view returns(uint) {
        return _soulContentCount[_soulId];
    }
}