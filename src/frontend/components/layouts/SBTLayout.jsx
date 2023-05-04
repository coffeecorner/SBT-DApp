/* eslint-disable react-hooks/exhaustive-deps */
import SBTCard from "../Cards/SBTCard";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

import sbtData from "../../data/sbtData";

import styles from "./styles.module.scss";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

const SBTLayout = (data) => {
    /* useEffect(() => {
        const connectionValue = localStorage?.getItem("isConnectionEstablished" === true);
        if (window.ethereum.isConnected()) {
            web3Handler();
        }
    }) */
    const { soulHub, soul, account, sbt } = data;
    const [soulName, setSoul] = useState();

    const router = useParams();
    useEffect(() => {
        if (!soulName) setSoul(router.soul);
        //console.log(soul);
    })

    const loadSBTs = async () => {
        const sbtCount = await sbt.tokenCount();
        let sbts = [];

        const sbtMapping = await soulHub._sbtItems(1);
        console.log(sbtMapping);
    }

    return (
        <>
            {soul && 
                <div className={styles.SoulsContainer}>
                <div className={styles.CardsContainer}>
                    {sbtData.filter((x) => x.soulKeyword === soulName).map((data, index) => {
                        return (
                            <SBTCard key={index} props={data} />
                        )
                    })}
                </div>
                <Button onClick={loadSBTs}>button</Button>
            </div>}
        </>
    )
}

export default SBTLayout