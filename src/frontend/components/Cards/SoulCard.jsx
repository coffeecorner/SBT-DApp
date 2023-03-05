import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import styles from "./styles.module.scss";

const SoulCard = () => {
    return (
        <Card className={styles.Card}>
          <Card.Header>Featured</Card.Header>
          <Card.Body>
            <Card.Title>Special title treatment</Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional content.
            </Card.Text>
            <Button variant="outline-dark" href="/1/sbt">Go Somewhere</Button>
          </Card.Body>
        </Card>
    );
}

export default SoulCard;