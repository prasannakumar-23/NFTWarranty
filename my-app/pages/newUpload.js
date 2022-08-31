import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../storage/base";
import { Contract, providers, utils, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "../constants/index";
import styles from "./../styles/newProduct.module.css";
import NavBar from "../components/NavBar";
//import Image from "next/image";

const NewUpload = () => {
  const [productName, setproductName] = useState("");
  const [productId, setproductId] = useState("");
  const [productDesc, setproductDesc] = useState("");
  const [productAttr, setproductAttr] = useState("");
  const [serialNumbers, setserialNumbers] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [url, setUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warrantyTimeMonths, setWarrantyTimeMonths] = useState(0);
  const [warrantyTimeDays, setWarrantyTimeDays] = useState(0);
  const [warrantyTimeSeconds, setWarrantyTimeSeconds] = useState(0);
  const web3ModalRef = useRef();
  const tokenIds = useRef(1);

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

  const handleChangeInputFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileRef = ref(storage, file.name);
      console.log("above a image");
      uploadBytes(fileRef, file).then((snapshot) => {
        console.log("Uploaded a image");
        getDownloadURL(snapshot.ref).then((url) => {
          setUrl(url);
        });
      });
    }
  };

  const mintEach = async (tokenId) => {
    const tx = await nftContract.mint(BigNumber.from(tokenId));
    await tx.wait();
    window.alert(`you succesfully minted ${tokenId}`);
  };

  const handleSubmit = async () => {
    let warrantyTime =
      (warrantyTimeMonths * 30 + warrantyTimeDays) * 24 * 60 * 60 +
      warrantyTimeSeconds;
    const newProduct = {
      pName: productName,
      pId: productId,
      pDesc: productDesc,
      pAttr: productAttr,
      sNums: serialNumbers,
      warrantyTime: warrantyTime,
      url: url,
    };

    console.log(newProduct);

    try {
      setLoading(true);

      console.log("minting nfts");
      let parsedsNums = serialNumbers.split(",");
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
          console.log(tokenId);
          const tx = await nftContract.mint(BigNumber.from(tokenId));
          await tx.wait();
          console.log("posting...");
          await axios.post(`/api/Txn/create`, {
            tokenId: tokenId,
            transactionHashes: [tx.hash],
            from: ["0x0000000000000000000000000000000000000000"],
            to: [address],
          });
          console.log(tx);
          console.log("added tx to db");
        })
      );

      await axios.post(`/api/Product/create`, newProduct);
      console.log("added to DB");

      window.alert(`You successfully minted ${size} nfts 🔥`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error occured");
      console.log(error);
    }
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

  function handleChangeFile(e) {
    if (e.target.files[0]) setFile(e.target.files[0]);
  }

  const renderImg = () => {
    if (url) {
      return <img src={url} alt={url} className={styles.loginImg} />;
    } else {
      return (
        <div
          className={styles.loginImg}
          style={{ color: "white", textAlign: "center", alignItems: "center" }}
        >
          Image loads Here
        </div>
      );
    }
  };

  const renderBody = () => {
    if (loading) {
      return <div>Please Wait while we are processing...⏳</div>;
    } else {
      return (
        <>
          <NavBar />
          <div className={styles.login}>
            <span className={styles.loginTitle}>Add new Product </span>
            <div className={styles.loginForm} style={{ marginBottom: "40px" }}>
              <div>
                <label for="myfile" style={{ color: "white" }}>
                  Select a image:
                </label>
                <input
                  type="file"
                  id="myfile"
                  name="myfile"
                  className={styles.choose}
                  style={{ color: "white", marginLeft: "20px" }}
                  onChange={handleChangeInputFile}
                />
              </div>
              <label className={styles.label}>Image</label>
              {/* <Image src={url} alt={url} className={styles.loginImg} /> */}
              {renderImg()}

              <label className={styles.label}>Product Name</label>
              <input
                className={styles.loginInput}
                type="text"
                placeholder="Enter Product Name"
                onChange={(e) => {
                  setproductName(e.target.value);
                }}
              />
              <label className={styles.label}>Product Id</label>
              <input
                className={styles.loginInput}
                type="text"
                placeholder="Enter Product Id"
                onChange={(e) => {
                  setproductId(e.target.value);
                }}
              />
              <label className={styles.label}>Product Description</label>
              <input
                type="text"
                className={styles.loginInput}
                placeholder="Enter Product Description"
                onChange={(e) => {
                  setproductDesc(e.target.value);
                }}
              />
              <label className={styles.label}>Product Attributes</label>
              <input
                type="text"
                className={styles.loginInput}
                placeholder="Enter Product Attributes"
                onChange={(e) => {
                  setproductAttr(e.target.value);
                }}
              />
              <label className={styles.label}>Warranty Time</label>
              <div style={{ display: "grid", paddingLeft: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <label
                    style={{
                      color: "white",
                      marginRight: "10px",
                      alignSelf: "center",
                    }}
                  >
                    Months :
                  </label>
                  <input
                    type="text"
                    placeholder="Warranty time in months"
                    className={styles.loginInput}
                    onChange={(e) => {
                      setWarrantyTimeMonths(e.target.value);
                    }}
                  />
                </div>
                <br />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <label
                    style={{
                      color: "white",
                      marginRight: "30px",
                      alignSelf: "center",
                    }}
                  >
                    Days :
                  </label>
                  <input
                    type="text"
                    className={styles.loginInput}
                    placeholder="Warranty time in Days"
                    onChange={(e) => {
                      setWarrantyTimeDays(e.target.value);
                    }}
                  />
                </div>
                <br />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <label
                    style={{
                      color: "white",
                      marginRight: "10px",
                      alignSelf: "center",
                    }}
                  >
                    Seconds :
                  </label>
                  <input
                    type="text"
                    placeholder="Warranty time in seconds"
                    className={styles.loginInput}
                    onChange={(e) => {
                      setWarrantyTimeSeconds(e.target.value);
                    }}
                  />
                </div>
              </div>

              <label className={styles.label}>Serial Numbers </label>

              <textarea
                className={styles.textarea}
                placeholder="You can enter multiple serial numbers seperated by comma ,"
                cols="10"
                rows="20"
                onChange={(e) => {
                  setserialNumbers(e.target.value);
                }}
              ></textarea>
              <button
                className={styles.loginButton}
                type="submit"
                onClick={handleSubmit}
              >
                Add
              </button>
            </div>
          </div>
        </>
      );
    }
  };

  return <div>{renderBody()}</div>;
};

export default NewUpload;
