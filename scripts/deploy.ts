import { ethers } from "hardhat";
import { NFT_CONTRACT_ADDRESS } from "../Constants";

async function main() {
  const lionsNFTContract = NFT_CONTRACT_ADDRESS;

  const lionToken = await ethers.getContractFactory("LionToken");
  const deployedLionContract = await lionToken.deploy(lionsNFTContract);

  await deployedLionContract.deployed();

  console.log(
    `The Lion Token contract adddress ${deployedLionContract.address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
