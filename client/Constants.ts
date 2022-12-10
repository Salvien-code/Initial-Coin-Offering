import tokenData from "./artifacts/contracts/LionToken.sol/LionToken.json";
import nftdata from "./artifacts/contracts/ILionNFT.sol/ILions.json";

export const WHITELIST_CONTRACT_ADDRESS =
  "0x9456b553C19EB546b3c0514F493B0fbE016a5c12";

export const NFT_CONTRACT_ADDRESS =
  "0x2F73b865A36232EBA48d859B849f83198106A807";

export const TOKEN_CONTRACT_ADDRESS =
  "0xD5b7AA31eD3BBF43f527b83443880e6257E34180";

export const NFT_CONTRACT_ABI = nftdata.abi;

export const TOKEN_CONTRACT_ABI = tokenData.abi;
