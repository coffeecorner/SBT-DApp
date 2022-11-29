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
    })

    describe("Deployment", function(){
        it("Should track name and addresses of the Soul collection", async function(){
            expect(await soul.getSoulName()).to.equal("education");
        });
    })

    describe("Making SBT Items", function(){
        it("Should track newly created item, assume SBT ownership and emit Offered event", async function(){
            await expect(soul.connect(addr1).mintSBT(sbt, soul.address))
                .to.emit(soul, "Offered")
                .withArgs(
                    1,
                    sbt.address,
                    soul.address,
                    addr1
                )
        });
    })
})