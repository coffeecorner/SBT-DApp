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
						<Card.Img style={{'width': '550px', 'height': '300px', 'object-fit': 'cover'}} as={Image} src={props?.file} fluid={true} alt="Card image" />
						<Card.Body>
							<Card.Title>{props?.name}</Card.Title>
							<Card.Text>
								{props?.description}
							</Card.Text>
							<Button href={props?.file} variant="primary">View Document</Button>
							<Button className={styles.button} variant="primary" href={props.id ? `/${props.id}/grant-access` : ''}>Grant Access</Button>
							<Card.Footer className="text-muted">{props?.soul?.replace(/(?:^|-)(\w)/g, (match, p1) => p1.toUpperCase()).replace(/-/g, ' ')}</Card.Footer>
						</Card.Body>
					</Card>
				}
        </>
    )
}

export default SBTCard;