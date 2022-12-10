import { ethers, run } from "hardhat";
import { setTimeout } from "timers/promises";
import { NFT_CONTRACT_ADDRESS } from "../client/Constants";

async function main() {
  const lionTokenFactory = await ethers.getContractFactory("LionToken");
  const lionTokenContract = await lionTokenFactory.deploy(NFT_CONTRACT_ADDRESS);

  await lionTokenContract.deployed();

  console.log(
    `Deployed the Lion Token contract to ${lionTokenContract.address}`
  );

  console.log(`Waiting for a minute before verifying Token contract`);
  await setTimeout(60000);

  await run("verify:verify", {
    address: lionTokenContract.address,
    constructorArguments: [NFT_CONTRACT_ADDRESS],
  });
  console.log(`Verified Lion Token contract on Etherscan`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
