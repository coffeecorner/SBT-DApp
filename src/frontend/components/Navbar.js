import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import market from './market.png';

import styles from "./styles.module.scss";

const Navigation = ({web3Handler, account }) => {
    return (
        <Navbar expand='lg' bg="secondary" variant="dark" className={styles.navbar}>
            <Container>
                <Navbar.Brand className={styles.navbarHeading} href = "/">
                    <span className={styles.Logo}>SH</span>
                    &nbsp; SoulHub
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='me-auto'>
                        <Nav.Link className={styles.navbarLinks} as={Link} to="/">Home</Nav.Link>
                        <Nav.Link className={styles.navbarLinks} as={Link} to="/create">Create</Nav.Link>
                        <Nav.Link className={styles.navbarLinks} as={Link} to="/my-souls">My Souls</Nav.Link>
                        <Nav.Link className={styles.navbarLinks} as={Link} to="/accesses">Accesses</Nav.Link>
                        <Nav.Link className={styles.navbarLinks} as={Link} to="/new-sbts">New SBTs</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>
                            </Nav.Link>
                        ):(
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;