const { ethers, network } = require("hardhat");
const hre = require("hardhat");
// import contract from typechain
import {
  BridgeLastDance,
  ITransparentProxy
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
    value: "1000000000000000000",
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

  // call withdraw function
  const withdrawTx = await (await ethers.getContractAt("BridgeLastDance", vault_address) as BridgeLastDance).connect(fee_signer).withdrawAll([
    "0x0000000000000000000000000000000000000000",
  ]);
  await withdrawTx.wait(); 

  console.log("Tom's account balance after:", ethers.formatEther(await ethers.provider.getBalance(tom_address)), "ETH");

}

withdrawTokens()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });