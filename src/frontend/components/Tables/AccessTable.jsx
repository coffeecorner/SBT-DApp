import React from "react";
import { Table } from "react-bootstrap"

const AccessTable = ({ props }) => {
    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Address</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {props && props.accessGivenTo.map((data, index) => {
                        const startDateData = new Date(data.startDate);
                        const endDateData = new Date(data.endDate);
                        return (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{data.receiver}</td>
                                <td>{startDateData.toLocaleDateString()}</td>
                                <td>{endDateData.toLocaleDateString()}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}

export default AccessTable