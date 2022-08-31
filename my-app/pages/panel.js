import { useRef, useState, useEffect } from "react";
import {
  Contract,
  providers,
  utils,
  BigNumber,
  getAddress,
  transactionProvider,
  getLogs,
} from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "../constants/index";
var Web3 = require("web3");
import styles from "./../styles/panel.module.css";
import { StyleSheetManager } from "styled-components";
import NavBar from "../components/NavBar";
const ethers = require("ethers");
const contractabi = require("../constants/cabi.json");

const Panel = () => {
  const [isRetailer, setIsRetailer] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const to = useRef();
  const web3ModalRef = useRef();
  const [status, setStatus] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [product, setProduct] = useState(null);
  const [reqMessage, setreqMessage] = useState(null);
  const [repairAddress, setrepairAddress] = useState(null);
  const [txnHashes, setTxnHashes] = useState(null);
  const [txnFrom, setTxnFrom] = useState(null);
  const [txnTo, setTxnTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const onPageLoad = async () => {
    await connectWallet();
    //main();
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.log(error);
    }
  };
  async function requestListener() {
    const contractAddress = "0x242Bfe278bdE88881d5A8feaB20Ea62F31b535c4";
    console.log(
      "wss://polygon-mumbai.g.alchemy.com/v2/zurJTrfSEQoqjKepEzLZvqqDUT87wIg_"
    );
    const provider = new ethers.providers.WebSocketProvider(
      "wss://polygon-mumbai.g.alchemy.com/v2/zurJTrfSEQoqjKepEzLZvqqDUT87wIg_"
    );
    const contract = new ethers.Contract(
      contractAddress,
      contractabi,
      provider
    );
    let count = 0;
    let info;
    contract.on("_req", (from, to, tokenId, event) => {
      info = {
        from: from,
        repairId: to,
        tokenId: ethers.BigNumber.from(tokenId).toString(),
        msg: event,
      };
      console.log(JSON.stringify(info, null, 4));

      console.log(count);
      count++;
      axios.post(`/api/ClaimWarranty/create`, info).then(() => {
        window.location.reload();
      });
      console.log("added to DB");
    });

    console.log("hello");
  }

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

  const burn = async (signer) => {
    console.log(new Date().toLocaleString());

    try {
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );

      const address = await signer.getAddress();
      const ad1 = await nftContract.ownerOf(BigNumber.from(tokenId));
      console.log(ad1);

      const tx = await nftContract.burn(
        BigNumber.from(tokenId),
        utils.getAddress(address)
      );
      await tx.wait();

      await axios.put(`/api/Txn/Update/${tokenId}`, {
        txnHash: tx.hash,
        from: ad1,
        to: "0x0000000000000000000000000000000000000000",
      });

      console.log(new Date().toLocaleString());
    } catch (err) {
      console.error(err);
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

  const transfer = async (signer) => {
    console.log(new Date().toLocaleString());
    console.log(typeof signer);
    console.log(tokenId);

    try {
      //const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );

      /* const temp = await transactionProvider;
      const logs = await getLogs({
        fromBlock: "0",
        toBlock: "latest",
        address: "0xa3E91d71a50f36c20382e132A34AC21b57C8B4bF",
      });
      console.log(logs);*/

      // nftContract.on("Transfer", (from, to, value, event) => {
      //   let info = {
      //     from: from,
      //     to: to,
      //     value: ethers.utils.formatUnits(value, 18),
      //   };
      //   console.log(JSON.stringify(info, null, 4));
      // });

      // const ad1 = await nftContract.ownerOf(BigNumber.from(tokenId));
      // console.log(ad1);
      const tx = await nftContract.transfer(
        signer.getAddress(),
        utils.getAddress(to.current),
        BigNumber.from(tokenId)
      );
      const address = await signer.getAddress();

      await tx.wait();
      await axios.put(`/api/Txn/Update/${tokenId}`, {
        txnHash: tx.hash,
        from: address,
        to: to.current,
      });

      console.log(new Date().toLocaleString());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    let curproduct = await axios.get(`/api/panel/${tokenId}`);
    let curtxnHis = await axios.get(`/api/Txn/${tokenId}`);
    let txnHis = curtxnHis.data;
    console.log(curproduct);
    //console.log(txnHis);

    setProduct(curproduct.data);
    setTxnHashes(txnHis.transactionHashes);
    setTxnFrom(txnHis.from);
    setTxnTo(txnHis.to);
    setStatus(true);
    console.log(status);
    console.log(product);
    console.log(txnHis);
  };

  const renderEachTransaction = (transactionHash, i) => {
    return (
      <tr className={styles.tra}>
        <td className={styles.tda}>{transactionHash}</td>
        <td className={styles.tda}>{txnFrom[i]}</td>
        <td className={styles.tda}>{txnTo[i]}</td>
      </tr>
    );
  };

  const renderBody = () => {
    if (status)
      return (
        <div>
          <div
            style={{
              marginTop: "80px",
              backgroundColor: "white",
              borderRadius: "20px",
              marginLeft: "100px",
              marginRight: "100px",
              color: "black",
            }}
          >
            <h1 style={{ textAlign: "center" }}>{product.name}</h1>

            <div className={styles.container}>
              <div className={styles.left}>
                <div className={styles.centered}>
                  {/* <Image src={product.url} alt={product.url} /> */}
                  <img src={product.url} alt={product.url} />
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.centered} style={{ color: "black" }}>
                  <h2>Product Id : {product.productId}</h2>
                  <h2>Serial No: {product.sNo}</h2>
                  <h2> Product Description:</h2>
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "80px",
              backgroundColor: "white",

              marginLeft: "100px",
              marginRight: "100px",
            }}
          >
            <table className={styles.tablea}>
              <tr className={styles.tra}>
                <td className={styles.tda}>Transaction Hash </td>
                <td className={styles.tda}>From Address</td>
                <td className={styles.tda}>To Address</td>
              </tr>
              {txnHashes.map(renderEachTransaction)}
            </table>
          </div>
        </div>
      );
  };

  const handleTransfer = async () => {
    const signer = await getProviderOrSigner(true);
    console.log("got signer");
    transfer(signer);
  };

  const handleTransferWithWarranty = async () => {
    const signer = await getProviderOrSigner(true);
    console.log(signer);
    await transfer(signer);
    let curproduct = await axios.get(`/api/${tokenId}`);
    let product = curproduct.data;
    console.log(product);

    let time = parseInt(product.attributes[1].value) * 1000;
    console.log("check");
    console.log(time);
    console.log(new Date().toLocaleString());

    setTimeout(() => {
      console.log("check");
      console.log(time);
      console.log(new Date().toLocaleString());
      console.log(signer);

      burn(signer);
    }, [time]);
  };
  const handleRequest = async () => {
    console.log(new Date().toLocaleString());
    console.log(typeof signer);
    console.log(tokenId);

    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      // const address = signer.getAddress();
      console.log("tx request sending..");
      console.log(repairAddress);
      console.log(reqMessage);

      const tx = await nftContract.request(
        utils.getAddress(repairAddress),
        BigNumber.from(tokenId),
        reqMessage
      );
      requestListener();
      await tx.wait();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };
  return (
    <>
      {loading ? (
        <div>Please Wait while we are processing...⏳</div>
      ) : (
        <>
          <NavBar />
          <div>
            <div>
              <div style={{ width: "400px", margin: "20px auto" }}>
                <div style={{ display: "grid" }}>
                  <div className={styles.loginhhtwo}>Token Id Please</div>
                  <input
                    className={styles.loginInput}
                    type="text"
                    onChange={(e) => {
                      setTokenId(e.target.value);
                    }}
                  />
                  <button className={styles.loginButton} onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              </div>
              {renderBody()}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  marginTop: "100px",
                  marginBottom: "50px",
                  height: "100%",
                }}
              >
                <div style={{ display: "grid" }}>
                  <div className={styles.loginhhtwo}>Address to deliver</div>
                  <input
                    className={styles.loginInput}
                    placeholder="address to deliver"
                    type="text"
                    onChange={(e) => {
                      to.current = e.target.value;
                    }}
                  />
                  <button
                    className={styles.loginButton}
                    onClick={handleTransfer}
                  >
                    Transfer
                  </button>
                  <button
                    className={styles.loginButton}
                    onClick={handleTransferWithWarranty}
                  >
                    Transfer with warranty enabled
                  </button>
                </div>

                <div style={{ display: "grid" }}>
                  <label className={styles.loginhhtwo}>Claim Warranty</label>
                  <input
                    type="text"
                    placeholder="Message"
                    className={styles.loginInput}
                    onChange={(e) => {
                      setreqMessage(e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Repairer address"
                    className={styles.loginInput}
                    style={{ marginTop: "20px" }}
                    onChange={(e) => {
                      setrepairAddress(e.target.value);
                    }}
                  />
                  <button
                    className={styles.loginButton}
                    onClick={handleRequest}
                  >
                    Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Panel;
