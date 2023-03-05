import React from "react";
import SoulCard from "../Cards/SoulCard";

import styles from "./styles.module.scss"

const SoulsLayout = () => {
    return (
        <>
            <div className={styles.SoulsContainer}>
                <div className={styles.CardsContainer}>
                    <SoulCard />
                    <SoulCard />
                    <SoulCard />
                    <SoulCard />
                    <SoulCard />
                </div>
            </div>
        </>
    )
}

export default SoulsLayout;