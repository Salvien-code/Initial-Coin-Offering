import { BigNumber } from "ethers";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const zero = BigNumber.from(0);

  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);

  return <div></div>;
}
