import Link from "next/link";
import { useContext } from "react";
import styles from "./../styles/navbar.module.css";

const NavBar = () => {
  return (
    <div>
      <div className={styles.top}>
        <div className={styles.topCenter}>
          <ul className={styles.topList}>
            <li className={styles.topListItem}>
              <Link className={styles.link} href="/admin">
                ADMIN
              </Link>
            </li>
            <li className={styles.topListItem}>
              <Link className={styles.link} href="/newUpload">
                NEW PRODUCT
              </Link>
            </li>
            <li className={styles.topListItem}>
              <Link className={styles.link} href="/oldUpload">
                OLD PRODUCT
              </Link>
            </li>
            <li className={styles.topListItem}>
              <Link className={styles.link} href="/panel">
                PANEL
              </Link>
            </li>
            <li className={styles.topListItem}>
              <Link className={styles.link} href="/approved">
                APPROVED
              </Link>
            </li>
            <li className={styles.topListItem}>
              <Link className={styles.link} href="/approve">
                APPROVE/REJECT
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <hr></hr>
    </div>
  );
};

export default NavBar;
