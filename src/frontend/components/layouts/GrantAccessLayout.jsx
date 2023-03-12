/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AccessTable from "../Tables/AccessTable";
import { Button, Modal, Form } from "react-bootstrap";

import { grantAccessData } from "../../data/GrantAccessData";
import styles from "./styles.module.scss";

const GrantAccessLayout = () => {
    const [id, setId] = useState();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const router = useParams();
    useEffect(() => {
        if (!id) setId(router.sbtId);
    })
    console.log(id);
    return (
        <>
        <div className={styles.GrantAccessLayoutContainer}>
            {id && grantAccessData.filter((x) => x.sbtId === Number(id)).map((data, index) => {
                console.log('test', data);
                <h1>test</h1>
                return (
                    <>
                        <AccessTable key={index} props={data} />
                    </>
                )
            })}
            <Button onClick={handleShow}>Grant Access</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Grant Access</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>SBT Id</Form.Label>
                        <Form.Control placeholder={id} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Receiver Address</Form.Label>
                        <Form.Control placeholder={`Enter the receiver's address`} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="duedate"
                            placeholder="Start date"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="duedate"
                            placeholder="End date"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
        </>
    )
}

export default GrantAccessLayout