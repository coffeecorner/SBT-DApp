/* eslint-disable jest/valid-describe-callback */
/* eslint-disable jest/valid-expect */
const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString()) //1 ether = 10*18 wei
const fromWei = (num) => ethers.utils.formatEther(num);

describe("SBT", async function(){
    let deployer, addr1, addr2, sbt;
    let URI = "Sample URI";

    beforeEach(async function(){
        const SBT = await ethers.getContractFactory("SBT");

        //Get signers
        [deployer, addr1, addr2] = await ethers.getSigners();

        //Deploy contract
        sbt = await SBT.deploy();
    })

    describe("Deployment", function(){
        it("Should track name and symbol of the SBT collection", async function(){
            expect(await sbt.name()).to.equal("DApp SBT");
            expect(await sbt.symbol()).to.equal("DAPP");
        })
    })

    describe("Minting SBTs", function() {
        it("Should track each minted SBT", async function(){
            //addr1 mints an nft
            await sbt.connect(addr1).mint(URI);
            expect(await sbt.tokenCount()).to.equal(1);
            expect(await sbt.balanceOf(addr1.address)).to.equal(1);
            expect(await sbt.tokenURI(1)).to.equal(URI);

            //addr2 mints an sbt
            await sbt.connect(addr2).mint(URI);
            expect(await sbt.tokenCount()).to.equal(2);
            expect(await sbt.balanceOf(addr2.address)).to.equal(1);
            expect(await sbt.tokenURI(2)).to.equal(URI);
        })

        it("Should track the owner of the newly created SBT", async function (){
            await sbt.connect(addr1).mint(URI);
            expect(await sbt.ownerOf(1)).to.equal(addr1.address);
        })
    });
}) 

describe("Soul", async function(){
    let deployer, addr1, addr2, soul;
    let name = "Soul";
    const soulName = "Education";
    const soulName_2 = "Internship";

    beforeEach(async function(){
        const Soul = await ethers.getContractFactory("Soul");

        //Get signers
        [deployer, addr1, addr2] = await ethers.getSigners();

        //Deploy contracts
        soul = await Soul.deploy("Soul");
    })

    describe("Deployment", function(){
        it("Should track name of the Soul contract deployed", async function(){
            expect(await soul.getSoulContractName()).to.equal("Soul");
        });
    })

    describe("Minting Souls", function(){
        it("Should track each minted Soul", async function(){
            //addr1 mints a soul
            await soul.connect(addr1).createSoul(soulName);
            expect(await soul.getSoulCount()).to.equal(1);
            expect(await soul.getSoulName(1)).to.equal(soulName);

            //addr2 mints a soul
            await soul.connect(addr2).createSoul(soulName_2);
            expect(await soul.getSoulCount()).to.equal(2);
            expect(await soul.getSoulName(2)).to.equal(soulName_2);
        });

        it("Should track the owner of the newly created Soul", async function (){
            await soul.connect(addr1).createSoul(soulName);
            expect(await soul.getOwner(1)).to.equal(addr1.address);
        })
    })
    
})

describe("SoulHub", async function() {
    let deployer, addr1, addr2, addr3, sbt, soul, soulHub;
    let soulName = "Education";
    let URI = "Sample URI";
    let fee = 0.0021;
    let feeInWei = toWei(fee);

    beforeEach(async function(){
        const SBT = await ethers.getContractFactory("SBT");
        const Soul = await ethers.getContractFactory("Soul");
        const SoulHub = await ethers.getContractFactory("SoulHub");

        //Get signers
        [deployer, addr1, addr2, addr3] = await ethers.getSigners();

        //Deploy contract
        sbt = await SBT.deploy();
        soul = await Soul.deploy("Soul");
        soulHub = await SoulHub.deploy(feeInWei);

        await sbt.connect(addr1).mint(URI);
        await soul.connect(addr1).createSoul(soulName);

        //add1 approves soul
        await sbt.connect(addr1).setApprovalForAll(soulHub.address, true)
    })

    describe("Deployment", function() {
        it("Should track feeAccount and fee of the application contract", async function(){
            expect(await soulHub.feeAccount()).to.equal(deployer.address);
            expect(await soulHub.fee()).to.equal(feeInWei);
        })
    })

    describe("Gas fee transfer", function() {
        it("Should track if the gas is being transferred", async function() {
            // let sendInitialBalance = await addr1.getBalance();
            // let feeAccInitialBalance = await deployer.getBalance();

            expect(await soulHub.transferGas({value: feeInWei}));

            // let sendFinalBalance = await addr1.getBalance();
            // let feeAccFinalBalance = await deployer.getBalance();
            // console.log("deployer:",feeAccInitialBalance," ",feeAccFinalBalance);
            // console.log("addr1:", sendInitialBalance," ", sendFinalBalance);
        })
    })

    describe("SBT Item creation", function(){
        it("Should create SBT items, assign ownership and transfer Gas fees", async function(){
            /* console.log('deployer');
            console.log(await deployer.getBalance()); */

            expect(await soulHub.connect(addr1).createSBTItem(sbt.address, 1, 1, {value: feeInWei}))
            .to.emit(soulHub, "Offered")
            .withArgs(1,sbt.address,1,1,addr1.address);

            /* console.log('deployer');
            console.log(await deployer.getBalance()); */

            await sbt.connect(addr2).mint(URI);
            expect(await soulHub.connect(addr2).createSBTItem(sbt.address, 2, 1, {value: feeInWei}))
            .to.emit(soulHub, "Offered")
            .withArgs(2,sbt.address,2,1,addr2.address);
            
        })

        it("Should create SBT items for another user, transfer ownership and transfer Gas fees", async function(){
            expect(await soulHub.connect(addr1).createSBTItemFor(sbt.address, 1, 1, addr2.address, {value: feeInWei}))
            .to.emit(soulHub, "Received")
            .withArgs(1,sbt.address,1,1,addr1.address,addr2.address)

            await sbt.connect(addr2).mint(URI);
            await sbt.connect(addr2).setApprovalForAll(soulHub.address, true)
            expect(await soulHub.connect(addr2).createSBTItemFor(sbt.address, 2, 1, addr3.address, {value: feeInWei}))
            .to.emit(soulHub, "Received")
            .withArgs(2,sbt.address,2,1,addr2.address,addr3.address)
        })
        
    })

    describe("Soul Item creation", function(){
        it("Should track the creation of a soul", async function() {
            expect(await soulHub.connect(addr1).createSoulItem(soul.address, 1, {value: feeInWei}))
            .to.emit(soulHub, "CreatedSoul")
            .withArgs(1,soul.address,addr1.address)
        })
    })

    describe("SBT-Soul relationship tracking", function(){
        it("Should keep track of the SBTs associated with every soul", async function(){
            await soulHub.connect(addr1).createSBTItem(sbt.address, 1, 1, {value: feeInWei})
            
            //addr2 creates a soul with id 2 and name "Internship"
            await soul.connect(addr2).createSoul("Internship");

            //addr2 mints an SBT and creates SBT item for the id 2
            await sbt.connect(addr2).mint(URI);
            await soulHub.connect(addr2).createSBTItem(sbt.address, 2, 2, {value: feeInWei})

            //addr2 mints an SBT and creates SBT item for id 3
            await sbt.connect(addr2).mint(URI);
            await soulHub.connect(addr2).createSBTItem(sbt.address, 3, 2, {value: feeInWei})


            expect(await soulHub.getSoulContentCount(1)).to.equal(1);
            expect(await soulHub.getSoulContentCount(2)).to.equal(2);
        })
    })

    describe("Access permission tracking", function(){
        it("Should be able to grant and check access permission", async function(){
            await soulHub.connect(addr1).createSBTItem(sbt.address, 1, 1, {value: feeInWei})

            expect(await soulHub.connect(addr1).grantAccess(sbt.address, 1, addr2.address))
            .to.emit(soulHub, "AccessGranted")
            .withArgs(1, sbt.address, 1, addr1.address, addr2.address)

            expect(await soulHub.connect(addr1).checkAccess(1, addr2.address)).to.equal(true);
        })

        it("Should be able to revoke and check access permission", async function(){
            await soulHub.connect(addr1).createSBTItem(sbt.address, 1, 1, {value: feeInWei})

            expect(await soulHub.connect(addr1).grantAccess(sbt.address, 1, addr2.address))
            .to.emit(soulHub, "AccessGranted")
            .withArgs(1, sbt.address, 1, addr1.address, addr2.address)

            expect(await soulHub.connect(addr1).revokeAccess(sbt.address, 1, addr2.address))
            .to.emit(soulHub, "AccessRevoked")
            .withArgs(1, sbt.address, 1, addr1.address, addr2.address)

            expect(await soulHub.connect(addr1).checkAccess(1, addr2.address)).to.equal(false);
        })
    })
})
