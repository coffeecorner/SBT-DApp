import React from "react";

import SoulCard from "../Cards/SoulCard";
import styles from "./styles.module.scss";
import soulData from "../../data/SoulData";

const SoulsLayout = ({ web3Handler }) => {
    return (
        <>
            <div className={styles.SoulsContainer}>
                <div className={styles.CardsContainer}>
                    {soulData.map((data, index) => {
                        return (
                            <SoulCard key={index} props={data}/>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default SoulsLayout;