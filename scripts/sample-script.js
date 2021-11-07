// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  

  // Kovan Testnet
  const uniswapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  const multiDaiKovan = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
  const WETH9 = "0xd0A1E359811322d97991E03f863a0C30C2cF029C";

  // We get the contract to deploy
  const StableCoinsConverter = await hre.ethers.getContractFactory("StableCoinsConverter");
  const stableCoinsConverter = await StableCoinsConverter.deploy(uniswapRouter, multiDaiKovan, WETH9);

  await stableCoinsConverter.deployed();

  console.log("StableCoinsConverter deployed to:", stableCoinsConverter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
