import { useState, useEffect } from 'react';
import {Button, Modal, Form, Col, Row} from 'react-bootstrap';

const AppointmentForm = ({patient}) => {
    const [show, setShow] = useState(false);
    const [doctors, setDoctors] = useState([])

    const fetchDoctors = () => {
        fetch("http://localhost:3000/admin/doctors", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
        .then(resp => resp.json())
        .then(data => {
            setDoctors(data)
        })
    }

    useEffect (() => {
        fetchDoctors()
    }, [])

    

    return (
        <Modal show={show} onHide={() => setShow(false)} animation={false}>
        {/* <Modal.Header><Modal.Title>Add Insurance Info</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Insurance Name</Form.Label>
                    <Form.Control type="text" name="name" value="" onChange={handleChange}/>
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Subscriber Name</Form.Label>
                    <Form.Control type="text" name="subscriber_name" value="" onChange={handleChange}/>
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Subscriber Number</Form.Label>
                    <Form.Control type="text" name="subscriber_number" value="" onChange={handleChange}/>
                </Form.Group>      
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                    <Form.Label>Group Number</Form.Label>
                    <Form.Control type="text" name="group_number" value="" onChange={handleChange}/>
                </Form.Group>
                <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>         
            </Form>
        </Modal.Body> */}
    </Modal>
    )
}

export default AppointmentForm;