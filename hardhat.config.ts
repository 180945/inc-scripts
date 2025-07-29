import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";

const dotenv = require("dotenv");
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
        {
            version: "0.8.28",
        },
    ],
  },
  defaultNetwork: process.env.NETWORK || "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        url: process.env.BSC_URL || "https://eth.api.onfinality.io/public",
      },
      chainId: 56,
    },
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [`0x${process.env.ADMIN_KEY}`, `0x${process.env.OPERATOR_KEY}`],
    },
    ethereum: {
      url: process.env.ETHEREUM_URL,
      accounts: [`0x${process.env.ADMIN_KEY}`, `0x${process.env.OPERATOR_KEY}`],
      chainId: 1,
    },
    bsc: {
      url: process.env.BSC_URL,
      accounts: [`0x${process.env.ADMIN_KEY}`, `0x${process.env.OPERATOR_KEY}`],
      chainId: 56,
    },
    polygon: {
      url: process.env.POLYGON_URL,
      accounts: [`0x${process.env.ADMIN_KEY}`, `0x${process.env.OPERATOR_KEY}`], 
      chainId: 137,
    },
  },
};

export default config;
