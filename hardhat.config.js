require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 4
    },
    // npx hardhat run scripts/sample-script.js --network rinkeby
    rinkeby: {
      url: `https://eth-rinkeby.gateway.pokt.network/v1/lb/${process.env.POKT_NETWORK_KEY}`,
      accounts: [process.env.PRIVATEKEY],
      gasPrice: 8000000000     // Default is 'auto' which breaks chains without the london hardfork
    }
  },
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
