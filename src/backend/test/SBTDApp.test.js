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

