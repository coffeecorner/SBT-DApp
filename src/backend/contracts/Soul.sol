// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Soul is ReentrancyGuard {

    //state variables
    uint public soulCount;

    // Soul contract name
    string private name;

    // Mapping from soul ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping from soul ID to name of the soul
    mapping(uint256 => string) private _soulNames;

    // Mapping owner address to the count of souls they own
    //mapping(address => uint256) private _soulBalances;

    constructor(string memory _name){
        name = _name;
    }

    event CreatedSoul(
        uint soulId,
        string soulName,
        address indexed owner
    );

    function getSoulContractName() public view returns (string memory) {
        return name;
    }

    function getSoulCount() public view returns(uint) {
        return soulCount;
    }

    function getSoulName(uint _soulId) public view returns (string memory){
        return _soulNames[_soulId];
    }

    function getOwner(uint _soulId) public view returns (address){
        return _owners[_soulId];
    }

    function createSoul(string memory _soulName) public returns(uint){
        soulCount++;

        //update owner
        _owners[soulCount] = msg.sender;

        //update name
        _soulNames[soulCount] = _soulName;

        emit CreatedSoul(
            soulCount,
            _soulName,
            msg.sender
        );

        return soulCount;
    }

}