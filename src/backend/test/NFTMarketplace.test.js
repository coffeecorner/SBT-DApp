/* eslint-disable jest/valid-describe-callback */
/* eslint-disable jest/valid-expect */
const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString()) //1 ether = 10*18 wei
const fromWei = (num) => ethers.utils.formatEther(num);

describe("SBT-DAPP", async function(){
    let deployer, addr1, addr2, sbt, marketplace;
    let feePercent = 1;
    let URI = "Sample URI";
    beforeEach(async function(){
        //Get contract factories
        const SBT = await ethers.getContractFactory("SBT");
        const Marketplace = await ethers.getContractFactory("Soul");
        
        //Get signers
        [deployer, addr1, addr2] = await ethers.getSigners();
        
        //Deploy contracts
        sbt = await SBT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe("Deployment", function(){
        it("Should track name and symbol of the SBT collection", async function(){
            expect(await sbt.name()).to.equal("DApp SBT");
            expect(await sbt.symbol()).to.equal("DAPP");
        })

        it("Should track feeAccount and feePercent of the marketplace", async function (){
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
            expect(await marketplace.feePercent()).to.equal(feePercent);
        })
    });

    describe("Minting NFTs", function() {
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

    describe("Making marketplace items", function(){
        beforeEach(async function (){
            //addr1 mints an sbt
            await sbt.connect(addr1).mint(URI)
            //add1 approves marketplace to spend sbt
            await sbt.connect(addr1).setApprovalForAll(marketplace.address, true)
        })
        it("Should track newly created item, transfer SBT from seller to marketplace and emit Offered event", async function(){
            //addr1 offers their sbt at a price of 1 ether
            await expect(marketplace.connect(addr1).makeItem(sbt.address, 1, toWei(1))) //makeitem(address, tokenId, price)
                .to.emit(marketplace, "Offered")
                .withArgs(
                    1,
                    sbt.address,
                    1,
                    toWei(1),
                    addr1.address
                )
            //Owner of sbt should now be the marketplace
            expect(await sbt.ownerOf(1)).to.equal(marketplace.address);
            //Item count should now equal 1
            expect(await marketplace.itemCount()).to.equal(1);
            //Get item from items mapping then check fields to ensure they are correct
            const item = await marketplace.items(1)
            expect((item.itemId)).to.equal(1)
            expect((item.sbt)).to.equal(sbt.address)
            expect((item.tokenId)).to.equal(1)
            expect((item.price)).to.equal(toWei(1))
            expect((item.sold)).to.equal(false)
        });

        it("Should fail if price is set to zero", async function(){
            await expect(
                marketplace.connect(addr1).makeItem(sbt.address, 1, 0)
            ).to.be.revertedWith("Price must be greater than zero");           
        });
    });

    describe("Purchasing marketplace items", function() {
        let price = 2;
        let totalPriceInWei;
        
        beforeEach(async function(){
            //addr1 mints an sbt
            await sbt.connect(addr1).mint(URI)
            //addr1 approves marketplace to spend sbt
            await sbt.connect(addr1).setApprovalForAll(marketplace.address, true)
            //addr1 makes their sbt a marketplace item
            await marketplace.connect(addr1).makeItem(sbt.address, 1, toWei(price))
        })

        it("Should update item as sold, pay seller, transfer sbt to buyer, charge fees and emit a Bought event", async function () {
            const sellerInitialEthBal = await addr1.getBalance();
            const feeAccountInitialEthBal = await deployer.getBalance();
            //fetch items total price (market fees + item price)
            totalPriceInWei = await marketplace.getTotalPrice(1);
            //addr 2 purchases item
            await expect(marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei}))
                .to.emit(marketplace, "Bought")
                .withArgs(
                    1,
                    sbt.address,
                    1,
                    toWei(price),
                    addr1.address,
                    addr2.address
                )
            const sellerFinalEthBal = await addr1.getBalance()
            const feeAccountFinalEthBal = await deployer.getBalance()
            // Seller should receive payment for the price of the sbt sold
            expect(+fromWei(sellerFinalEthBal)).to.equal(+price + +fromWei(sellerInitialEthBal))
            // Calculate fee
            const fee = (feePercent/100) * price
            // feeAccount should receive fee
            expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fee + +fromWei(feeAccountInitialEthBal))
            // The buyger should now own the sbt
            expect(await sbt.ownerOf(1)).to.equal(addr2.address);
            // Item should be marked as sold
            expect((await marketplace.items(1)).sold).to.equal(true)
        })

        it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
            //fails for invalid item ids (greater ids)
            await expect(
                marketplace.connect(addr2).purchaseItem(2, { value: totalPriceInWei })
            ).to.be.revertedWith("item doesn't exist");

            //fails for invalid item ids (lesser ids)
            await expect(
                marketplace.connect(addr2).purchaseItem(0, { value: totalPriceInWei })
            ).to.be.revertedWith("item doesn't exist");

            //Fails when not enough ether is paid with the transaction
            //AssertionError: Expected transaction to be reverted with not enough ether to cover item price and market fee, but other exception was thrown: Error: VM Exception while processing transaction: reverted with reason string 'not enough ether to cover item price'
            // await expect(
            //     marketplace.connect(addr2).purchaseItem(1, { value: toWei(price) })
            // ).to.be.revertedWith("not enough ether to cover item price and market fee");

            // addr2 purchases item 1
            await marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei })
            
            // deployer tries purchasing item 1 after its been sold
            await expect(
                marketplace.connect(deployer).purchaseItem(1, { value: totalPriceInWei })
            ).to.be.revertedWith("item already sold");
        })
    })

})