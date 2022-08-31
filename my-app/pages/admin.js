import { useRef, useState, useEffect } from "react";
import { Contract, providers, utils } from "ethers";
import Link from "next/link";
import styles from "./../styles/admin.module.css";
import Web3Modal from "web3modal";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "../constants/index";
import NavBar from "../components/NavBar";

const Admin = () => {
  const [data, setData] = useState("");
  const [repairerAddress, setRepairerAddress] = useState();
  const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => renderBody(res[0]));
    } else {
      alert("install metamask extension!!");
    }
    const renderBody = (account) => {
      setData(account);
    };
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "polygon_mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      onPageLoad();
    }
  }, []);

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.log(error);
    }
  };

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

  const onPageLoad = async () => {
    await connectWallet();
  };

  // useEffect(() => {
  //   if (!walletConnected) {
  //     web3ModalRef.current = new Web3Modal({
  //       network: "polygon_mumbai",
  //       providerOptions: {},
  //       disableInjectedProvider: false,
  //     });
  //     onPageLoad();
  //   }
  // }, []);

  const Emoji = (props) => (
    <span
      className="emoji"
      role="img"
      aria-label={props.label ? props.label : ""}
      aria-hidden={props.label ? "false" : "true"}
    >
      {props.symbol}
    </span>
  );
  const handleClick = async () => {
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );

      const tx = await nftContract.setRepairer(
        utils.getAddress(repairerAddress)
      );
      await tx.wait();
      window.alert("sucesfully added repairer");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  return (
    <>
      {loading ? (
        <div>Please Wait while we are processing...⏳</div>
      ) : (
        <div>
          <NavBar />
          <div style={{ paddingTop: "30px" }}>
            <h1
              className={styles.topListItem}
              style={{ fontFamily: "helvatica sans-serif" }}
            >
              Welcome
            </h1>
            <h2
              style={{
                textAlign: "center",
                fontFamily: "helvatica sans-serif",
              }}
            >
              {data} <Emoji symbol="" />
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "100px",
            }}
          >
            <div style={{ display: "grid" }}>
              <input
                type="text"
                className={styles.loginInput}
                style={{ margin: "20px", fontSize: "16px" }}
                placeholder="Enter address"
                onChange={(e) => {
                  setRepairerAddress(e.target.value);
                }}
              />
              <button
                type="button"
                className={styles.gloww}
                style={{ margin: "20px", fontSize: "16px" }}
                onClick={handleClick}
              >
                Make Repairer{" "}
              </button>
            </div>
            <div style={{ display: "grid" }}>
              <Link href="/newUpload">
                <button
                  type="button"
                  className={styles.gloww}
                  style={{ margin: "20px", fontSize: "16px" }}
                >
                  {" "}
                  New Product
                </button>
              </Link>
              <Link href="/oldUpload">
                <button
                  type="button"
                  className={styles.gloww}
                  style={{ margin: "20px", fontSize: "16px" }}
                >
                  Old Product{" "}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
