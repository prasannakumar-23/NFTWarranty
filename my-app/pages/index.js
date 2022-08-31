import Head from "next/head";
import styles from "../styles/Home.module.css";

import Card from "../components/card";
import { useRef, useState, useEffect } from "react";
import { Contract, providers, utils, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import Link from "next/link";
import {
  RETAILER_CONTRACT_ADDRESS,
  RETAILER_CONTRACT_ABI,
} from "../constants/retailers";
import Nav from "../components/Nav";

const Home = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whiteListed, setWhiteListed] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Polygon Mumbai");
      throw new Error("Change network to Polygon Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      await getProviderOrSigner();
      setLoading(false);
      setWalletConnected(true);
      checkIfAddressInWhitelist();
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const addtoWhiteList = async () => {
    try {
      setLoading(true);

      const signer = await getProviderOrSigner(true);

      const retailerContract = new Contract(
        RETAILER_CONTRACT_ADDRESS,
        RETAILER_CONTRACT_ABI,
        signer
      );

      const tx = await retailerContract.addAddressToWhitelist();

      await tx.wait();
      setWhiteListed(true);
      setLoading(false);
      window.alert("Sucessfuly Registered,you can now access our admin page!");
    } catch (err) {
      console.error(err.message);
    }
  };

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.loginButton}>
          Connect your wallet
        </button>
      );
    }
    if (loading) {
      return <button className={styles.loginButton}>Loading...</button>;
    }
    if (whiteListed) {
      return (
        <div className={styles.logini}>
          <Link href="/admin">
            <button className={styles.loginButton} type="button">
              Go to Admin Page
            </button>
          </Link>
        </div>
      );
    }
    if (!whiteListed) {
      return (
        <div className={styles.logini}>
          <button className={styles.loginButton} onClick={addtoWhiteList}>
            Register with us
          </button>
        </div>
      );
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const retailerContract = new Contract(
        RETAILER_CONTRACT_ADDRESS,
        RETAILER_CONTRACT_ABI,
        signer
      );
      setLoading(true);
      const address = await signer.getAddress();

      const _joinedWhitelist = await retailerContract.whitelistedAddresses(
        address
      );
      console.log(_joinedWhitelist);
      setWhiteListed(_joinedWhitelist);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "polygon_mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, []);

  return (
    <div className={styles.page}>
      <Head>
        <title>Grid 4.0 team phoniex</title>
        <meta name="description" content="grid 4.0" />
      </Head>

      <Nav />

      <div className={styles.logini}>{renderButton()}</div>

      <div className="container-fluid" style={{ marginTop: "100px" }}>
        <div className={styles.login}>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
};

export default Home;
