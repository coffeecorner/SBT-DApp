import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import styles from "./styles.module.scss";

const SoulCard = ({ web3Handler, props }) => {
  /* console.log(props?.soulName.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()) */

    return (
      <>
      {props &&
        <Card className={styles.Card}>
          <Card.Body>
            <Card.Title>{props?.soulName}</Card.Title>
            <Card.Text>
              {props?.Description}
            </Card.Text>
            <Button variant="outline-dark" href={props?.id} onClick={web3Handler}>View SBTs</Button>
          </Card.Body>
          <Card.Footer className="text-muted"><b>Count: </b>{props.sbtCount}</Card.Footer>
        </Card>
      }
      </>
    );
}

export default SoulCard;