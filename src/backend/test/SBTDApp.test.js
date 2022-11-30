/* eslint-disable jest/valid-describe-callback */
/* eslint-disable jest/valid-expect */
const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString()) //1 ether = 10*18 wei
const fromWei = (num) => ethers.utils.formatEther(num);

/* describe("SBTHub")

describe("Soul") */

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
    let deployer, addr1, addr2, sbt, soul;
    let URI = "Sample URI";

    beforeEach(async function(){
        const SBT = await ethers.getContractFactory("SBT");
        const Soul = await ethers.getContractFactory("Soul");
        const soulName = "education";

        //Get signers
        [deployer, addr1, addr2] = await ethers.getSigners();

        //Deploy contract
        sbt = await SBT.deploy();
        soul = await Soul.deploy(soulName);

        //addr1 mints an sbt
        await sbt.connect(addr1).mint(URI)
        //add1 approves soul
        await sbt.connect(addr1).setApprovalForAll(soul.address, true)
    })

    describe("Deployment", function(){
        it("Should track name and addresses of the Soul collection", async function(){
            expect(await soul.getSoulName()).to.equal("education");
        });
    })

    describe("Making SBT Items", function(){
        it("Should track newly created item, assume SBT ownership and emit Offered event", async function(){
            await expect(soul.connect(addr1).mintSBT(sbt.address, soul.address))
                .to.emit(soul, "Offered")
                .withArgs(
                    1,
                    sbt.address,
                    soul.address,
                    addr1.address,
                )
        });

        it("Should track newly minted objects for another party, transfer ownership and emit Offered and Received events", async function(){
            await expect(soul.connect(addr1).mintSBTFor(sbt.address, addr2.address, soul.address))
            .to.emit(soul, "Offered")
            .withArgs(
                1,
                sbt.address,
                soul.address,
                addr1.address
            )
            .to.emit(soul, "Received")
            .withArgs(
                1,
                sbt.address,
                soul.address,
                addr1.address,
                addr2.address
            )
        })
    })
})

describe("SoulHub", async function() {
    let deployer, addr1, addr2, sbt, soul, soulHub;
    let URI = "Sample URI";
    let fee = toWei(0.0021);

    beforeEach(async function(){
        const SBT = await ethers.getContractFactory("SBT");
        const Soul = await ethers.getContractFactory("Soul");
        const SoulHub = await ethers.getContractFactory("SoulHub");
        const soulName = "education";

        //Get signers
        [deployer, addr1, addr2] = await ethers.getSigners();

        //Deploy contract
        sbt = await SBT.deploy();
        soul = await Soul.deploy(soulName);
        soulHub = await SoulHub.deploy(fee);
    })

    describe("Deployment", function() {
        it("Should track feeAccount and fee of the application", async function() {
            expect(await soulHub.feeAccount()).to.equal(deployer.address);
            expect(await soulHub.fee()).to.equal(fee);
        })
    })

    describe("SoulName and GasTransfer", async function() {
        it("Should track the name of the created soul", async function() {
            expect(await soulHub.getSoulName(soul.address)).to.equal("education")
        })

        it("Should track if the gas is being transferred", async function() {
            expect(await soulHub.transferGas())
        })
    })

    describe("Make soul", async function() {
        it("Should track the creation of a soul", async function() {
            expect(await soulHub.connect(addr1).makeSoul(soul.address))
            .to.emit(soulHub, "CreatedSoul")
            .withArgs(
                1,
                soul.address,
                addr1.address
            )
        })
    })
})