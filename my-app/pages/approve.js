import { useRef, useState, useEffect } from "react";
import {
  Contract,
  providers,
  utils,
  ethers,
  BigNumber,
  getAddress,
  transactionProvider,
  getLogs,
} from "ethers";
//import main from "../testing/scripts";
import Web3Modal from "web3modal";
import axios from "axios";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "../constants/index";
var Web3 = require("web3");
import styles from "./../styles/panel.module.css";
import { StyleSheetManager } from "styled-components";
const contractabi = require("../constants/cabi.json");
import NavBar from "../components/NavBar";

const Approve = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [approveArray, setApproveArray] = useState();
  const [status, setStatus] = useState(false);
  const web3ModalRef = useRef();
  const [loading, setLoading] = useState(false);
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

  const handleFetch = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      const approvals = await axios.get(`/api/ClaimWarranty/${address}`);

      setApproveArray(approvals.data.txn);

      if (approvals.data.txn.length != 0) {
        setStatus(true);
      } else {
        setStatus(false);
      }

      console.log(approvals.data.txn.length);
    } catch (err) {
      console.log(err);
    }
  };

  async function approveScript(doc_id) {
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
    contract.on("_aproove", (from, to, tokenId, event) => {
      console.log("Inside _aproove");
      axios.put(`/api/ClaimWarranty/update`, { _id: doc_id }).then(() => {
        window.location.reload();
      });
    });
  }

  const handleApprove = async (userId, doc_id, msg, tokenId) => {
    console.log(doc_id);
    console.log(userId);
    console.log(msg);
    console.log(tokenId);

    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );
      const address = await signer.getAddress();
      console.log(address);
      console.log("tx approve sending..");

      const tx = await nftContract.aproove(
        utils.getAddress(userId),
        utils.getAddress(address),
        BigNumber.from(tokenId),
        msg
      );
      approveScript(doc_id);
      await tx.wait();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleReject = async (e) => {
    const doc_id = e.target.value;
    console.log(doc_id);

    try {
      await axios.delete(`/api/ClaimWarranty/delete`, {
        data: { docId: doc_id },
      });
      window.alert(`Request rejected`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const each = (approval) => {
    return (
      <div
        style={{
          marginTop: "80px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "20px",
          color: "black",
        }}
      >
        <h4 className={styles.headings}>
          <h4 className={styles.mainHead}>User Id </h4>
          {approval.from}
        </h4>
        <h4 className={styles.headings}>
          <h4 className={styles.mainHead}>Message </h4>
          {approval.msg}
        </h4>
        <h4 className={styles.headings}>
          <h4 className={styles.mainHead}>Token Id </h4>
          {approval.tokenId}
        </h4>
        <h4 className={styles.headings}>
          <h4 className={styles.mainHead}>Document Id </h4>
          {approval._id}
        </h4>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              margin: "20px",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "black",
              fontSize: "16px",
              color: "white",
              cursor: "pointer",
            }}
            value={approval._id}
            onClick={() => {
              handleApprove(
                approval.from,
                approval._id,
                approval.msg,
                approval.tokenId
              );
            }}
          >
            Approve
          </button>
          <button
            style={{
              margin: "20px",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "black",
              fontSize: "16px",
              color: "white",
              cursor: "pointer",
            }}
            value={approval._id}
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </div>
    );
  };

  //   const renderBody = () => {
  //     return approveArray.map(each);
  //   };

  return (
    <>
      {loading ? (
        <div>Please Wait while we are processing...⏳</div>
      ) : (
        <div>
          <NavBar />
          <div
            className={styles.login}
            style={{ width: "70%", margin: "0px auto 20px" }}
          >
            <button onClick={handleFetch} className={styles.loginButton}>
              See
            </button>
            {status ? approveArray.map(each) : ""}
          </div>
        </div>
      )}
    </>
  );
};

export default Approve;
