const { ethers, network } = require("hardhat");
import {
  BridgeLastDance,
  ITransparentProxy
} from "../typechain-types";

async function withdrawTokens() {
  const [admin, operator] = await ethers.getSigners();

  const vault_address = "0x43d037a562099a4c2c95b1e2120cc43054450629";

  //STEP 1: deploy new contract
  const lastDance = await ethers.getContractFactory("BridgeLastDance");
  const lastDanceInstance = await lastDance.connect(operator).deploy();
  await lastDanceInstance.waitForDeployment();
  const lastDanceAddress = await lastDanceInstance.getAddress();
  
  console.log("LastDance contract deployed to:", lastDanceAddress);

  //STEP 2: upgrade proxy contract
  const transparent = await ethers.getContractAt("ITransparentProxy", vault_address) as ITransparentProxy;
  const recieptTx = await transparent.connect(admin).upgradeTo(lastDanceAddress); 

  await recieptTx.wait();

  console.log(`Upgrade successful with hash: ${recieptTx.hash}`);

  //STEP 3: call withdraw function
  //get the token address from the tokens.json file
  const tokens = require("../tokens.json");
  const tokenAddress = tokens[network.config.chainId];

  const withdrawTx = await (await ethers.getContractAt("BridgeLastDance", vault_address) as BridgeLastDance).connect(operator).withdrawAll(tokenAddress);
  await withdrawTx.wait(); 

  console.log(`Transaction successful with hash: ${withdrawTx.hash}`);
}

withdrawTokens()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });