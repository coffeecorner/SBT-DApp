// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Soul is ReentrancyGuard {
    //state variables
    // Soul name
    string private soulName;
    uint public itemCount;
    
    struct Item {
         uint itemId;
         IERC721 sbt;
         uint tokenId;
         address payable minter;
    }

    event Offered(
        uint itemId, 
        address indexed sbt,
        uint tokenId,
        address indexed minter
    );

    event Received(
        uint itemId,
        address indexed sbt,
        uint tokenId,
        address indexed minter,
        address indexed mintee
    );

     //itemId -> Item
     mapping (uint => Item) public items;

    constructor(uint _soulName){
        soulName = _soulName;
    }

    function soulName() public view virtual override returns (string memory) {
        return _soulName;
    }

    function makeItem(IERC721 _sbt, uint _tokenId) external nonReentrant{
        //require(_price>0,"Price must be greater than zero");

        //increment itemCount
        itemCount++;

        //transfer sbt
        _sbt.transferFrom(msg.sender, address(this), _tokenId);

        //add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _sbt,
            _tokenId,
            payable(msg.sender)
        );

        //emit Offered event
        emit Offered(
            itemCount,
            address(_sbt),
            _tokenId,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant{
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price");
        require(!item.sold, "item already sold");

        //pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);

        //update item to sold
        item.sold = true;

        //transfer sbt to buyer
        item.sbt.transferFrom(address(this), msg.sender,item.tokenId);

        //emit Bought event
        emit Received(
            _itemId,
            address(item.sbt),
            item.tokenId,
            item.seller,
            msg.sender
        );
    }

    function mintSBTFor(IERC721 _sbt, uint _tokenId, address indexed _mintee) external nonReentrant{
        
        //increment itemCount
        itemCount++;

        //transfer sbt
        _sbt.transferFrom(msg.sender, address(this), _tokenId);

        //add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _sbt,
            _tokenId,
            payable(msg.sender)
        );

        //emit Offered event
        emit Offered(
            itemCount,
            address(_sbt),
            _tokenId,
            msg.sender
        );

        //emit Received event
        emit Received(
            itemCount,
            address(_sbt),
            _tokenId,
            msg.sender,
            _mintee
        );
    }

    function getTotalPrice(uint _itemId) view public returns(uint){
        return(items[_itemId].price*(100+feePercent)/100);
    }
}