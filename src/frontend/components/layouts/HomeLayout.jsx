import React from "react";
import { Carousel } from "react-bootstrap";
import { homeSbtData } from "../../data/HomeSbtData";
import sbtData from "../../data/sbtData";
import soulData from "../../data/SoulData";
import SBTCard from "../Cards/SBTCard";
import SoulCard from "../Cards/SoulCard";

import styles from "./styles.module.scss"

const HomeLayout = () => {
  return (
    <>
      <div className={styles.HomeLayoutContainer}>
        <h2>Souls</h2>
        <div className={styles.CardsContainer}>
          {soulData.filter((x, filterIndex) => filterIndex < 3).map((data, index) => {
            return (
              <>
                <SoulCard key = {index} props = {data} />
              </>
            )
          })}
        </div>
        <h2>SBTs</h2>
        <div className={styles.CardsContainer}>
          {homeSbtData.map((data, index) => {
            return (
              <>
                <SBTCard key = {index} props = {data} />
              </>
            )
          })}
        </div>
      </div>
    </>
  );
}

export default HomeLayout;