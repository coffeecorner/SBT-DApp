import React, { useEffect } from "react";

import styles from "./styles.module.scss";
import AccessCard from "../Cards/AccessCard";
import { accessData } from "../../data/AccessData";

const AccessLayout = ({ web3Handler, sbt, soul, soulHub }) => {

    const getAccessibleSBT = async (id) => {
        let accessibleSBTIds = await soulHub._activeSBTs(id);
        console.log(accessibleSBTIds);
    }

    useEffect(() => {
        getAccessibleSBT(1);
    });

    return (
        <>
            <div className={styles.SoulsContainer}>
                <div className={styles.CardsContainer}>
                    {accessData.map((data, index) => {
                        return (
                            <AccessCard key={index} props={data}/>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default AccessLayout;