// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Soul is ReentrancyGuard {
    //state variables
    string public soulName;
    uint public itemCount;
    
    struct Item {
         uint tokenId;
         IERC721 sbt;
         address soul;
         address payable minter;
    }

    event Offered(
        uint tokenId,
        address indexed sbt,
        address soul,
        address minter
    );

    event Received(
        uint tokenId,
        address indexed sbt,
        address soul,
        address minter,
        address mintee
    );

     //itemId -> Item
     mapping (uint => Item) public items;

    constructor(string memory _soulName){
        soulName = _soulName;
    }

    function getSoulName() public view returns (string memory) {
        return soulName;
    }

    function mintSBT(IERC721 _sbt, address _soul) public nonReentrant{
        //require(_price>0,"Price must be greater than zero");

        //increment itemCount
        itemCount++;

        //add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _sbt,
            _soul,
            payable(msg.sender)
        );

        //emit Offered event
        emit Offered(
            itemCount,
            address(_sbt),
            _soul,
            msg.sender
        );
    }

    function mintSBTFor(IERC721 _sbt, address _mintee, address _soul) public nonReentrant{
        
        //increment itemCount
        itemCount++;

        //transfer sbt
        _sbt.transferFrom(msg.sender, _mintee, item);

        //add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _sbt,
            _soul,
            payable(msg.sender)
        );

        //emit Offered event
        emit Offered(
            itemCount,
            address(_sbt),
            address(_soul),
            msg.sender
        );

        //emit Received event
        emit Received(
            itemCount,
            address(_sbt),
            address(_soul),
            msg.sender,
            _mintee
        );
    }

}