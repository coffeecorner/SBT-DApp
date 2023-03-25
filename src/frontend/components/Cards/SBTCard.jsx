import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button"
import { Image } from "react-bootstrap";

import styles from "./styles.module.scss";

const SBTCard = ({ props }) => {
    return (
        <>
				{props && 
					<Card className={styles.Card}>
						{/* <Card.Img variant="top" src={props.imgSrc} /> */}
						<Card.Img style={{'width': '550px', 'height': '300px', 'object-fit': '100% 0'}} as={Image} src={props.imgSrc} fluid={true} alt="Card image" />
						<Card.Body>
							<Card.Title>{props.titile}</Card.Title>
							<Card.Text>
								{props.desc}
							</Card.Text>
							<Button variant="primary">View Document</Button>
							<Button variant="primary" href={props.id ? `/${props.id}/grant-access` : ''}>Grant Access</Button>
							<Card.Footer className="text-muted">{props.soul}</Card.Footer>
						</Card.Body>
					</Card>
				}
        </>
    )
}

export default SBTCard;