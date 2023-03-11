import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Image } from "react-bootstrap";

import styles from "./styles.module.scss";

const AccessCard = ({ web3Handler, props }) => {
    return (
      <>
      {props && 
		    <Card className={styles.Card}>
                <Card.Header>{props.owner}</Card.Header>
				{/* <Card.Img variant="top" src={props.imgSrc} /> */}
					<Card.Img as={Image} src={props.imgSrc} fluid={true} alt="Card image" />
					<Card.Body>
						<Card.Title>{props.titile}</Card.Title>
						<Card.Text>
							{props.desc}
						</Card.Text>
						<Button variant="primary">View Document</Button>
					    <Card.Footer className="text-muted">{props.soul}</Card.Footer>
					</Card.Body>
				</Card>
		}
      </>
    );
}

export default AccessCard;