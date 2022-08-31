import React from "react";
import styles from "./../styles/Home.module.css";

const Card = () => {
  return (
    <div>
      <div
        className={styles.post}
        style={{ borderRadius: "10px", padding: "10px" }}
      >
        <h3 className={styles.postTitle}>Card title</h3>
        <img className={styles.postImg} src="..." alt="Card image cap" />
        <p className={styles.postDesc}>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <div className={styles.buttonmiddle}>
          <button className={styles.loginButtontwo}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
