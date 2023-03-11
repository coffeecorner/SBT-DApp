/* eslint-disable react-hooks/exhaustive-deps */
import SBTCard from "../Cards/SBTCard";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

import sbtData from "../../data/sbtData";

import styles from "./styles.module.scss";
import { useParams } from "react-router-dom";

const SBTLayout = ({ web3Handler, account}) => {
    /* useEffect(() => {
        const connectionValue = localStorage?.getItem("isConnectionEstablished" === true);
        if (window.ethereum.isConnected()) {
            web3Handler();
        }
    }) */
    const [soul, setSoul] = useState();

    const router = useParams();
    useEffect(() => {
        if (!soul) setSoul(router.soul);
        console.log(soul);
    })

    return (
        <>
            {soul && 
                <div className={styles.SoulsContainer}>
                <div className={styles.CardsContainer}>
                    {sbtData.filter((x) => x.soulKeyword === soul).map((data, index) => {
                        return (
                            <SBTCard key={index} props={data} />
                        )
                    })}
                </div>
            </div>}
        </>
    )
}

const mapStateToProps = (state) => ({
    loggedIn: state.loggedIn,
    account: state.account,
    networkId: state.networkId,
  });
  
  export default connect(mapStateToProps)(SBTLayout);