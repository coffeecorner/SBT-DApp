import React, { useEffect, useState } from "react";

import styles from "./styles.module.scss"
import PendingSBTCard from "../Cards/PendingSBTCard";

const PendingSBTsLayout = (props) => {
    const { soulHub, sbt, soul } = props;

    const [sbtArray, setSbtArray] = useState();

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
            {sbtArray &&  
                <div className={styles.SoulsContainer}>
                <div className={styles.CardsContainer}>
                    {sbtArray?.map((data, index) => {
                        return (
                            <PendingSBTCard key={index} data={data} soul={soul} soulHub={soulHub} propsData={props} />
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

export default PendingSBTsLayout;