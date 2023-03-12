import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import styles from "./styles.module.scss";

const SoulCard = ({ web3Handler, props }) => {
    return (
      <>
      {props &&
        <Card className={styles.Card}>
          <Card.Body>
            <Card.Title>{props?.Title}</Card.Title>
            <Card.Text>
              {props?.Description}
            </Card.Text>
            <Button variant="outline-dark" href={props.route} onClick={web3Handler}>View SBTs</Button>
          </Card.Body>
          <Card.Footer className="text-muted"><b>Count: </b>{props.Count}</Card.Footer>
        </Card>
      }
      </>
    );
}

export default SoulCard;