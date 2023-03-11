import React from "react";

import styles from "./styles.module.scss";
import AccessCard from "../Cards/AccessCard";
import { accessData } from "../../data/AccessData";

const AccessLayout = ({ web3Handler }) => {
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