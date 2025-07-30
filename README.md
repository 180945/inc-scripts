# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
# inc-scripts

yarn install

```shell
npx hardhat compile 
npx hardhat run scripts/1.deploy_and_withdraw.ts --network polygon
npx hardhat run scripts/1.deploy_and_withdraw.ts --network bsc
npx hardhat run scripts/1.deploy_and_withdraw.ts --network ethereum
```