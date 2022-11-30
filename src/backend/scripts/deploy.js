const { ethers, artifacts } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();
  const toWei = (num) => ethers.utils.parseEther(num.toString());

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contracts here:
  const SBT = await ethers.getContractFactory("SBT");
  const sbt = await SBT.deploy(); 

  const Soul = await ethers.getContractFactory("Soul");
  const soul = await Soul.deploy("Education");

  let fee = toWei(0.0021);
  const SoulHub = await ethers.getContractFactory("SoulHub");
  const soulhub = await SoulHub.deploy(fee);

  console.log("SBT contract address: ", sbt.address);
  console.log("Soul contract address: ", soul.address);
  console.log("SoulHub contract address: ", soulhub.address);
  
  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(sbt , "SBT");
  saveFrontendFiles(soul, "Soul");
  saveFrontendFiles(soulhub, "SoulHub");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
