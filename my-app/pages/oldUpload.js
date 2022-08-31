import axios from "axios";
import { useRef, useState, useEffect } from "react";
//import Product from "../models/Product";
import { Contract, providers, utils, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "../constants/index";
import styles from "./../styles/oldProduct.module.css";
import NavBar from "../components/NavBar";

const OldUpload = () => {
  const [sNums, setsNums] = useState("");
  const [pId, setpId] = useState("");

  const [product, setProduct] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

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

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "polygon_mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      onPageLoad();
    }
  }, []);

  const parseSerialNums = () => {
    parsedsNums = sNums.split(",");
    console.log(parsedsNums);
  };

  const handleUpload = async () => {
    try {
      setLoading(true);

      console.log("minting nfts");
      let parsedsNums = sNums.split(",");
      let size = parsedsNums.length;
      const signer = await getProviderOrSigner(true);

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      const address = await signer.getAddress();
      console.log("starting transaction");

      await Promise.all(
        parsedsNums.map(async (tokenId) => {
          const tx = await nftContract.mint(BigNumber.from(tokenId));
          await tx.wait();
          console.log("hello world");
          await axios.post(`/api/Txn/create`, {
            tokenId: tokenId,
            transactionHashes: [tx.hash],
            from: ["0x0000000000000000000000000000000000000000"],
            to: [address],
          });
        })
      );

      // setLoading(true);
      await axios.put(`/api/Product/${pId}`, {
        sNums: sNums,
      });

      console.log("added to DB");
      window.alert(`You successfully minted ${size} nfts 🔥`);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error occured");
    }
  };

  const handleInfo = async () => {
    let Product = await axios.get(`/api/Detection/${pId}`);
    console.log(Product.data);
    setProduct(Product.data);
    setStatus(true);
  };

  const renderInfo = () => {
    console.log(status);
    if (status) {
      return (
        <div
          style={{
            marginTop: "80px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "10px",

            color: "black",
          }}
        >
          <div className={styles.text}>
            <h1 style={{ color: "black" }}>{product.name}</h1>
          </div>
          <div className={styles.container}>
            <div className={styles.centered}>
              <img src={product.url}></img>
            </div>

            <div className={styles.centered} style={{ marginLeft: "30px" }}>
              <h2>Product Id : {pId}</h2>
              <h2> Product Description:</h2>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderBody = () => {
    if (loading) {
      return <div>Please Wait while we are processing...⏳</div>;
    } else {
      return (
        <div className={styles.login}>
          <span className={styles.loginTitle}>Old Product</span>
          <div className={styles.loginForm}>
            <label className={styles.label}>Product Id</label>
            <input
              className={styles.loginInput}
              placeholder="Just Enter product Id we will fetch remaining info ✔"
              type="text"
              onChange={(e) => {
                setpId(e.target.value);
              }}
            />
            <button className={styles.loginButton} onClick={handleInfo}>
              Get Information
            </button>
            {renderInfo()}
            <label className={styles.label}>Serial Numbers</label>
            <textarea
              cols="30"
              rows="10"
              placeholder="You can enter multiple serial numbers seperated by comma ,"
              className={styles.textarea}
              onChange={(e) => {
                setsNums(e.target.value);
              }}
            ></textarea>
            <button className={styles.loginButton} onClick={handleUpload}>
              Add
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <NavBar />

      {renderBody()}
    </>
  );
};

export default OldUpload;
