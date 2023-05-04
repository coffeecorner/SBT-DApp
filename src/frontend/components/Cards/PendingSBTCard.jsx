import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button"
import { Image, Dropdown } from "react-bootstrap";

import styles from "./styles.module.scss";
import { useEffect, useState } from "react";

const PendingSBTCard = (props) => {
    const { soul, propsData, soulHub, data } = props;
    const { account } = propsData;

    const [soulsArray, setSoulsArray] = useState();
    const [activeSoul, setActiveSoul] = useState();

    const loadSouls = async () => {
        const soulCount = await soul?.getSoulCount();
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

    return (
        <>
				{props && 
					<Card className={styles.Card}>
						{/* <Card.Img variant="top" src={props.imgSrc} /> */}
						<Card.Img style={{'width': '550px', 'height': '300px', 'object-fit': 'cover'}} as={Image} src={data?.file} fluid={true} alt="Card image" />
						<Card.Body>
							<Card.Title>{data?.name}</Card.Title>
							<Card.Text>
								{data?.description}
							</Card.Text>
							<Button className={styles.button} href={data?.file} variant="primary">View Document</Button>
							<Card.Footer className="text-muted">
                            <Dropdown className={`d-inline mx-2 ${styles.dropdown}`} autoClose="true">
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {activeSoul ? activeSoul : 'Select a Soul'}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {soulsArray?.map((data, index) => {
                                        return (
                                            <Dropdown.Item 
                                                key={index}
                                                onClick={() => {setActiveSoul(data?.soulName)}}
                                            >
                                                {data?.soulName}
                                            </Dropdown.Item>
                                        )
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                            </Card.Footer>
						</Card.Body>
					</Card>
				}
        </>
    )
}

export default PendingSBTCard;