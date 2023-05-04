/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SBTCard from "../Cards/SBTCard";
import sbtData from "../../data/sbtData";
import styles from "./styles.module.scss";

const SBTLayout = (data) => {
    /* useEffect(() => {
        const connectionValue = localStorage?.getItem("isConnectionEstablished" === true);
        if (window.ethereum.isConnected()) {
            web3Handler();
        }
    }) */
    const { soulHub, soul, account, sbt } = data;
    const [soulName, setSoul] = useState();
    const [sbtArray, setSbtArray] = useState();

    const router = useParams();
    useEffect(() => {
        if (!soulName) setSoul(router.soul);
        //console.log(soul);
    })

    const loadSBTs = async () => {
        const sbtCount = await sbt.tokenCount();
        let sbts = [];

        for (let i = 1; i <= sbtCount; i++) {
            const sbtItem = await soulHub._sbtItems(i);
            const sbtUri = await sbt.tokenURI(sbtItem.tokenId);

            const response = await fetch(sbtUri);
            sbts.push(await response.json());
        }

        setSbtArray(sbts);
    }

    useEffect(() => {
        loadSBTs();
    }, []);

    return (
        <>
            {soul && 
                <div className={styles.SoulsContainer}>
                <div className={styles.CardsContainer}>
                    {sbtArray?.map((data, index) => {
                        return (
                            <SBTCard key={index} props={data} />
                        )
                    })}
                    {/* {sbtArray.map((x) => x.soulKeyword === soulName).map((data, index) => {
                        return (
                            <SBTCard key={index} props={data} />
                        )
                    })} */}
                </div>
            </div>}
        </>
    )
}

export default SBTLayout