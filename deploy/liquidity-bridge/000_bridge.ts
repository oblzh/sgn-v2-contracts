import * as dotenv from 'dotenv';
import { ethers } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { utils, Wallet } from 'zksync-web3';

import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

dotenv.config();

const deployFunc = async (hre: HardhatRuntimeEnvironment) => {
  // Initialize the wallet.
  const wallet = new Wallet(process.env.ZK_SYNC_PRIVATE_KEY as string);

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact('MessageBus');

  // Estimate contract deployment fee
  // const deploymentFee = await deployer.estimateDeployFee(artifact, []);

  // // Deposit some funds to L2 in order to be able to perform L2 transactions.
  // const depositHandle = await deployer.zkWallet.deposit({
  //   to: deployer.zkWallet.address,
  //   token: utils.ETH_ADDRESS,
  //   amount: deploymentFee.mul(2)
  // });
  // // Wait until the deposit is processed on zkSync
  // await depositHandle.wait();

  //const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  //console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  // deploy pegbridgeV2
  //const args = [process.env.PEGGED_TOKEN_BRIDGE_SIGS_VERIFIER];
  //const pegV2Contract = await deployer.deploy(artifact, args);

  // deploy message bus
  const args = [
    process.env.MESSAGE_BUS_SIGS_VERIFIER,
    process.env.MESSAGE_BUS_LIQUIDITY_BRIDGE as string,
    process.env.MESSAGE_BUS_PEG_BRIDGE as string,
    process.env.MESSAGE_BUS_PEG_VAULT as string,
    process.env.MESSAGE_BUS_PEG_BRIDGE_V2 as string,
    process.env.MESSAGE_BUS_PEG_VAULT_V2 as string
  ];
  const messageBusContract = await deployer.deploy(artifact, args);


  // deploy bridge
  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  //const bridgeContract = await deployer.deploy(artifact, []);

  // Show the contract info.
  const contractAddress = messageBusContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
};

export default deployFunc;
