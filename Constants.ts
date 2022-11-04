import tokenData from "./artifacts/contracts/LionToken.sol/LionToken.json";
import nftdata from "./artifacts/contracts/ILions.sol/ILions.json";

export const WHITELIST_CONTRACT_ADDRESS =
  "0x9bc835359D63Ad432C9F1794C28c08228FEb459A";

export const METADATA_URL = "https://nft-collection-sneh1999.vercel.app/api/";

export const NFT_CONTRACT_ADDRESS =
  "0xDd4B76DA2b18a8C28B3fC9054BbeE0c19921ff37";

export const NFT_CONTRACT_ABI = nftdata.abi;

export const TOKEN_CONTRACT_ADDRESS =
  "0x0faB803f6CEB8BAe4109AFDceA745DF2D698E48c";

export const TOKEN_CONTRACT_ABI = tokenData.abi;
