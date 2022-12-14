import { BigNumber, Contract, providers, Signer, utils } from "ethers";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../Constants";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";

export default function Home() {
  const zero = BigNumber.from(0);

  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
  const [balanceOfLions, setBalanceOfLions] = useState(zero);

  const [tokenAmount, setTokenAmount] = useState(zero);
  const [tokensMinted, setTokensMinted] = useState(zero);

  const [isOwner, setIsOwner] = useState(false);
  const web3ModalRef = useRef();

  const getTokensToBeClaimed = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );

      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      const signer = (await getProviderOrSigner(true)) as Signer;
      const address = await signer.getAddress();
      const balance = await nftContract.balanceOf(address);

      if (balance === zero) {
        setTokensToBeClaimed(zero);
      } else {
        let amount = 0;

        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
          const claimed = await tokenContract.tokenIdsClaimed(tokenId);
          if (!claimed) {
            amount++;
          }
        }
        setTokensToBeClaimed(BigNumber.from(amount));
      }
    } catch (err) {
      console.error(err);
      setTokensToBeClaimed(zero);
    }
  };

  const getBalanceOfLionTokens = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      const signer = (await getProviderOrSigner(true)) as Signer;
      const address = await signer.getAddress();
      const balance = await tokenContract.balanceOf(address);

      setBalanceOfLions(balance);
    } catch (err) {
      console.error(err);
      setBalanceOfLions(zero);
    }
  };

  const mintLionToken = async (amount: number) => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );

      const value = 0.001 * amount;
      const tx = await tokenContract.mint(amount, {
        value: utils.parseEther(value.toString()),
      });

      setLoading(true);
      await tx.wait();

      setLoading(false);
      window.alert("Successfully minted Lion Token");
      await getBalanceOfLionTokens();
      await getTotalTokensMinted();
      await getTokensToBeClaimed();
    } catch (err) {
      console.error(err);
    }
  };

  const claimLionTokens = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );

      const tx = await tokenContract.claim();

      setLoading(true);
      await tx.wait();
      setLoading(false);

      window.alert("Successfully claimed Lion Token");

      await getBalanceOfLionTokens();
      await getTotalTokensMinted();
      await getTokensToBeClaimed();
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalTokensMinted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      const _tokensMinted = await tokenContract.totalSupply();
      setTokensMinted(_tokensMinted);
    } catch (err) {
      console.error(err);
    }
  };

  const getOwner = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      const _owner = await tokenContract.owner();
      const signer = (await getProviderOrSigner(true)) as Signer;

      const address = await signer.getAddress();
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const withdrawCoins = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );

      const tx = await tokenContract.withdraw();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getOwner();
    } catch (err) {
      console.error(err);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // @ts-ignore
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change the network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      // @ts-ignore
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
      getTotalTokensMinted();
      getBalanceOfLionTokens();
      getTokensToBeClaimed();
      getOwner();
    }
  }, [walletConnected]);

  const renderButton = () => {
    if (loading) {
      return (
        <div>
          <button className={styles.button}>Loading...</button>
        </div>
      );
    }

    if (tokensToBeClaimed.gt(0)) {
      return (
        <div>
          <div className={styles.description}>
            {tokensToBeClaimed.mul(10).toString()} Tokens can be claimed!
          </div>
          <button className={styles.button} onClick={claimLionTokens}>
            Claim Tokens
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: "flex-col" }}>
        <div>
          <input
            type="number"
            placeholder="Amount of Tokens"
            onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
            className={styles.input}
          />
        </div>
        <button
          className={styles.button}
          disabled={!tokenAmount.gt(0)}
          onClick={() => mintLionToken(tokenAmount.toNumber())}
        >
          Mint Tokens
        </button>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>Lion Tokens</title>
        <meta name="description" content="ICO-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to the Lion Token ICO</h1>
          <div className={styles.description}>
            You can claim or mint Lion Tokens here
          </div>

          {walletConnected ? (
            <div>
              <div className={styles.description}>
                You have minted {utils.formatEther(balanceOfLions).toString()}{" "}
                Lion Tokens
              </div>

              <div className={styles.description}>
                Overall {utils.formatEther(tokensMinted).toString()}/10000 have
                been minted!!!
              </div>

              {renderButton()}
              {isOwner ? (
                <div>
                  {loading ? (
                    <button className={styles.button}>Loading...</button>
                  ) : (
                    <button className={styles.button} onClick={withdrawCoins}>
                      Withdraw Coins
                    </button>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <button onClick={connectWallet} className={styles.button}>
              Connect your wallet
            </button>
          )}
        </div>

        <div>
          <Image src="/0.svg" width={300} height={300} alt={"Ethereum SVG"} />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Simon Samuel
      </footer>
    </div>
  );
}
