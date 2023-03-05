import SBTCard from "../Cards/SBTCard";
import { connect } from "react-redux";

import styles from "./styles.module.scss";

const SBTLayout = () => {
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

export default SBTLayout;