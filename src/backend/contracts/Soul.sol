// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Soul is ReentrancyGuard {
    //state variables
    string public soulName;
    uint public itemCount;
    
    struct Item {
         uint itemId;
         IERC721 sbt;
         address soul;
         uint tokenId;
         address payable minter;
    }

    event Offered(
        uint itemId, 
        address indexed sbt,
        address indexed soul,
        uint tokenId,
        address indexed minter
    );

    event Received(
        uint itemId,
        address indexed sbt,
        address soul,
        uint tokenId,
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

    function makeItem(IERC721 _sbt, uint _tokenId, address _soul) external nonReentrant{
        //require(_price>0,"Price must be greater than zero");

        //increment itemCount
        itemCount++;

        //transfer sbt
        _sbt.transferFrom(msg.sender, address(this), _tokenId);

        //add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _sbt,
            _soul,
            _tokenId,
            payable(msg.sender)
        );

        //emit Offered event
        emit Offered(
            itemCount,
            address(_sbt),
            _soul,
            _tokenId,
            msg.sender
        );
    }

    function mintSBTFor(IERC721 _sbt, uint _tokenId, address _mintee, address _soul) external nonReentrant{
        
        //increment itemCount
        itemCount++;

        //transfer sbt
        _sbt.transferFrom(msg.sender, _mintee, _tokenId);

        //add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _sbt,
            _soul,
            _tokenId,
            payable(msg.sender)
        );

        //emit Offered event
        emit Offered(
            itemCount,
            address(_sbt),
            address(_soul),
            _tokenId,
            msg.sender
        );

        //emit Received event
        emit Received(
            itemCount,
            address(_sbt),
            address(_soul),
            _tokenId,
            msg.sender,
            _mintee
        );
    }

}