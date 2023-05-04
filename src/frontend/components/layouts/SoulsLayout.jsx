import React, { useEffect, useState } from "react";

import SoulCard from "../Cards/SoulCard";
import styles from "./styles.module.scss";
import soulData from "../../data/SoulData";

const SoulsLayout = (data) => {
    const { account, soul, soulHub } = data;

    const [soulsArray, setSoulsArray] = useState();

    const loadSouls = async () => {
        const soulCount = await soul.getSoulCount();
        let souls = []

        for(let i=1; i<=soulCount; i++){
            const soulOwner = await soul.getOwner(i);
            if (soulOwner.toLowerCase() === account) {
                const soulname = await soul.getSoulName(i);
                const sbtCount = await soulHub.getSoulContentCount(i);
                souls.push({soulName: soulname, sbtCount: sbtCount.toNumber()});
            }
        }

        setSoulsArray(souls);
        
    }

    useEffect(() => {
        loadSouls();
    }, [])
    console.log(soulsArray);


    return (
        <>
            <div className={styles.SoulsContainer}>
                <div className={styles.CardsContainer}>
                    {soulsArray?.map((data, index) => {
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