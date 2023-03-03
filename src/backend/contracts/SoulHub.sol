// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./Soul.sol";
import "./SBT.sol";

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
         SBT sbt;
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

    event AccessGranted(
        uint sbtId,
        address indexed sbt,
        uint sbtItemId,
        address owner,
        address receiver
    );

    event AccessRevoked(
        uint sbtId,
        address indexed sbt,
        uint sbtItemId,
        address owner,
        address receiver
    );

    event LogMessage(string message, address feeAccountAddress);

    event LogBalance(uint256 balance);
    event LogFeeAccount(address feeAccount);

     //soulId -> soulItems
    mapping (uint => SoulItem) public _soulItems;

    //sbtId -> sbtItems
    mapping(uint => SBTItem) public _sbtItems;

    //soulId -> sbtCount
    mapping(uint => uint) public _soulContentCount;

    //sbtId -> addresses allowed to access
    mapping(uint => address[]) public _permittedUsers;

    //address -> currently valid SBTs that particular user has access to
    mapping(address => uint[]) public _activeSBTs;

    constructor(uint _fee){
        feeAccount = payable(msg.sender);
        fee = _fee;
    }

    //application functions
    function getBalance() public view returns(uint) {
        return msg.sender.balance; 
    }

    function transferGas() public payable {
        require(fee > 0, "Must send ether with callFeeAccount function");

        /* if (Address.isContract(feeAccount)) {
            (bool success, ) = feeAccount.call{value: fee}("");
            require(success, "Failed to send ether to feeAccount. Check that feeAccount has a fallback function that can receive ether.");
        } else {
            emit LogMessage("TEst", feeAccount);
            revert("feeAccount is not a valid contract address.");
        } */
        notDeployer();
        if (Address.isContract(getDeployer())) {
            address payable deployer = payable(getDeployer());
            deployer.transfer(fee);
        }
        else {
            revert("feeAccount is not a valid contract address.");
        }

    }

    /* function transferGass() public payable {
        uint256 balance = getBalance();
        require(balance > 0, "No fees to transfer");

        address payable feeAccount = payable(getDeployer());

        if (Address.isContract(feeAccount)) {
            feeAccount.transfer(msg.value);
        } else {
            revert("feeAccount is not a valid contract address.");
        }
    } */

    function transferGass() public payable {

        address payable feeAccount = payable(getDeployer());

        bool isContract = isEthereumAddress(feeAccount);
        require(isContract, "feeAccount is not a valid contract address.");

        uint256 balance = getBalance();
        require(balance > 0, "No fees to transfer");
        emit LogBalance(balance);
        emit LogFeeAccount(address(feeAccount));
        
        feeAccount.transfer(fee);
    }

    function isContract(address _addr) public view returns (bool) {
        uint size;
        assembly { size := extcodesize(_addr) }
        return size > 0;
    }

    function isEthereumAddress(address addr) public view returns (bool) {
        return !isContract(addr);
    }

    /* function transferFees() public payable {
        require(feeAccount != address(0), "Fee account not set");
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to transfer");
        payable(feeAccount).transfer(balance);
    } */

    function getDeployer() public view returns (address) {
        return feeAccount;
    }

    function notDeployer() public view {
        require(msg.sender != feeAccount, "Why is the fucking deployer making the request");
    }
    /* fallback() external {
    } */

    /* function callTransferGas() public {
        bool boolean = transferGas();
        require(boolean, "Ethers didn't transfer for fucks sake");
    } */

    //SBT operations
    function createSBTItem(SBT _sbt, uint _sbtId, uint _soulId) public nonReentrant{
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

    function createSBTItemFor(SBT _sbt, uint _sbtId, uint _soulId, address _mintee) public nonReentrant{
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

    //SBT accesses
    function grantAccess(SBT _sbt, uint _sbtId, address _to) public nonReentrant{
        require(_sbt.ownerOf(_sbtId)==msg.sender, "ERC5114: transfer caller is not owner nor approved");  

        //update address of the receiver against the sbtId
        _permittedUsers[_sbtId].push(_to);

        //add sbtId to the caller's accessible tokens
        _activeSBTs[_to].push(_sbtId);

        emit AccessGranted(
            _sbtId,
            address(_sbt),
            sbtItemCount,
            msg.sender,
            _to
        );
    }

    function revokeAccess(SBT _sbt, uint _sbtId, address _user) public nonReentrant{
        require(_sbt.ownerOf(_sbtId)==msg.sender, "ERC5114: transfer caller is not owner nor approved"); 

        //remove address of the receiver against sbt permissions
        for(uint i = 0; i < _permittedUsers[_sbtId].length; i++){
            if(_permittedUsers[_sbtId][i] == _user){
                _permittedUsers[_sbtId][i] = _permittedUsers[_sbtId][_permittedUsers[_sbtId].length - 1];
                _permittedUsers[_sbtId].pop();
            }
        }

        //remove sbtId from the caller's accessible tokens
        for(uint i = 0; i < _activeSBTs[_user].length; i++){
            if(_activeSBTs[_user][i] == _sbtId){
                _activeSBTs[_user][i] = _activeSBTs[_user][_activeSBTs[_user].length - 1];
                _activeSBTs[_user].pop();
            }
        }

        emit AccessRevoked(
            _sbtId,
            address(_sbt),
            sbtItemCount,
            msg.sender,
            _user
        );
    }

    function checkAccess(uint _sbtId, address _user) public view returns(bool){
        bool access = false;

        //check address of receiver against sbt permissions
        for(uint i = 0; i < _permittedUsers[_sbtId].length; i++){
            if(_permittedUsers[_sbtId][i] == _user){
               access = true;
            }
        }

        //check sbtId against caller's accessible tokens
        for(uint i = 0; i < _activeSBTs[_user].length; i++){
            if(_activeSBTs[_user][i] == _sbtId){
                access = true && access;
            }
        }

        return access;        
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