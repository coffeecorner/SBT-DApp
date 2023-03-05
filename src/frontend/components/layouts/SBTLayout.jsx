import SBTCard from "../Cards/SBTCard";
import { connect, useSelector } from "react-redux";

import styles from "./styles.module.scss";

const SBTLayout = (props) => {
    const provider = useSelector(state => state.web3.provider);
    const signer = useSelector(state => state.web3.signer);
    return (
        <>
            <div className={styles.SoulsContainer}>
                <div className={styles.CardsContainer}>
                    <SBTCard />
                    <SBTCard />
                    <SBTCard />
                    <SBTCard />
                    <SBTCard />
                    <SBTCard />
                    <SBTCard />
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    loggedIn: state.loggedIn,
    account: state.account,
    networkId: state.networkId,
  });
  
  export default connect(mapStateToProps)(SBTLayout);