import axios from "axios";
import { useRef, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import styles from "./../styles/approved.module.css";
const Approved = () => {
  const [claimed, setClaimed] = useState([]);
  const [tokenId, setTokenId] = useState(null);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const each = (claim) => {
    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          marginTop: "30px",
          marginLeft: "150px",
          marginRight: "150px",
          color: "black",
          padding: "10px",
          display: "inline - block",
          marginBottom: "30px",
        }}
      >
        <h2>Repair Details: {claim.msg}</h2>
        <h2>UserId : {claim.from}</h2>
        <h2>RepairId: {claim.repairId}</h2>
      </div>
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const cur_claimed = await axios.get(
        `/api/ClaimWarranty/Approved/${tokenId}`
      );
      setClaimed(cur_claimed.data.txn);
      if (cur_claimed.data.txn.length != 0) {
        setStatus(true);
      } else {
        setStatus(false);
      }
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
        <div className={styles.center}>
          <NavBar />
          <div
            style={{
              margin: "20px",

              textAlign: "center",
            }}
          >
            <h1>Approved Claims</h1>
            <div
              style={{ display: "grid", width: "70%", margin: "0px auto 20px" }}
            >
              <input
                type="text"
                className={styles.loginInput}
                style={{ width: "40%", margin: "0px auto 20px" }}
                onChange={(e) => {
                  setTokenId(e.target.value);
                }}
              />
              <button
                className={styles.loginButton}
                style={{ width: "40%", margin: "0px auto 20px" }}
                onClick={handleSubmit}
              >
                Submit
              </button>

              {status ? claimed.map(each) : ""}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Approved;
