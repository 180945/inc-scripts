const { ethers, network } = require("hardhat");

import {
  BridgeLastDance,
  ITransparentProxy,
  IERC20
} from "../typechain-types";

async function withdrawTokens() {
  const fee_account = "0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326";

  const tom_address = "0x037ac7fffc1c52cf6351e33a77edbdd14ce35040";
  const vault_address = "0x43d037a562099a4c2c95b1e2120cc43054450629";

  //  impersonating tom_address's account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [tom_address],
  });

  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [fee_account],
  });

  //   make tom_address the signer
  const signer = await ethers.getSigner(tom_address);
  const fee_signer = await ethers.getSigner(fee_account);

  //   create  transaction
  const tx = {
    to: tom_address,
    value: "10059240508501487",
  };

  const sendTx = await fee_signer.sendTransaction(tx);

  await sendTx.wait();

  // deploy new contract
  const lastDance = await ethers.getContractFactory("BridgeLastDance");
  const lastDanceInstance = await lastDance.connect(fee_signer).deploy();
  await lastDanceInstance.waitForDeployment();
  const lastDanceAddress = await lastDanceInstance.getAddress();
  
  console.log("LastDance contract deployed to:", lastDanceAddress);

  // upgrade proxy contract
  const transparent = await ethers.getContractAt("ITransparentProxy", vault_address) as ITransparentProxy;
  const recieptTx = await transparent.connect(signer).upgradeTo(lastDanceAddress); 

  await recieptTx.wait();

  console.log(`Transaction successful with hash: ${recieptTx.hash}`);
  const balance = await ethers.provider.getBalance(tom_address);
  console.log("Tom's account balance before:", ethers.formatEther(balance), "ETH");

  // get the token address from the tokens.json file
  const tokens = require("../tokens.json");
  const tokenAddress = tokens[network.config.chainId];
  
  let token;
  if (tokenAddress.length > 1) {
      // get token balance of tom_address
      token = await ethers.getContractAt("IERC20", tokenAddress[1]) as IERC20;
      const erc20_balance = await token.balanceOf(tom_address);
      console.log("Tom's erc20 token balance before:", erc20_balance);
  }

  // call withdraw function
  const withdrawTx = await (await ethers.getContractAt("BridgeLastDance", vault_address) as BridgeLastDance).connect(fee_signer).withdrawAll(tokenAddress);
  await withdrawTx.wait(); 

  console.log("Tom's account balance after:", ethers.formatEther(await ethers.provider.getBalance(tom_address)), "ETH");

  if (token) {
    console.log("Tom's erc20 token balance after:", await token.balanceOf(tom_address));
  }
}

withdrawTokens()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });