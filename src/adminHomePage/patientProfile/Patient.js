import {Card, Table, Button, Modal, Form, Col} from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const Patient = () => {
    const [patient, setPatient] = useState(null);
    const [show, setShow] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const patientId = parseInt(location.pathname.split("/admin/patient/")[1]); 

    const fetchPatient = (id) => {
        fetch(`http://localhost:3000/patients/${id}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
        .then(resp => resp.json())
        .then(data => {
            setPatient(data)})
    }

    const editPatient = (id, p) => {
        let obj = p ? (({name, email, address, phone_number}) => ({name, email, address, phone_number}))(p) : null
        let unedited =  p ? (({date_of_birth, race, ethnicity, language}) => ({date_of_birth, race, ethnicity, language}))(p) : null
        fetch(`http://localhost:3000/patients/${id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(obj)
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            setPatient({...data, ...unedited})
        })    
    }

    const handleChange = e => {
        setPatient({...patient, [e.target.name]: e.target.value})
    }

    const handleSubmit = e => {
        e.preventDefault();
        setShow(false)
        editPatient(patientId, patient)
        console.log(patient)
    }

    useEffect (() => {
        fetchPatient(patientId)
    }, [patientId])

    return (
        <div style={{marginTop: "100px"}}>
            <Card border="light" style={{width: "60rem", marginBottom: "30px"}}>
                {patient ?
                <Card.Body>
                    <Card.Title>{patient.name}  <Button variant="outline-primary">Make an Appointment</Button></Card.Title> 
                    <Table>
                        <tbody>
                            <td>
                                <Card.Text><h6>Date of Birth: </h6> {patient.date_of_birth}</Card.Text>
                                <Card.Text><h6>Address:</h6>  {patient.address}</Card.Text>
                                <Card.Text><h6>Phone Number:</h6>  {patient.phone_number}</Card.Text>
                                <Card.Text><h6>Email:</h6>  {patient.email}</Card.Text>
                                <Button variant="outline-primary" onClick={() => setShow(true)}>Edit Info</Button>
                            </td>
                            <td>
                                <Card.Text><h6>Ethnicity:</h6>  {patient.ethnicity}</Card.Text>
                                <Card.Text><h6>Race:</h6>  {patient.race}</Card.Text>
                                <Card.Text><h6>Language:</h6>  {patient.language}</Card.Text>
                            </td>
                        </tbody>
                    </Table>

                </Card.Body>: null
                }
        </Card>
        <Button variant="outline-primary">Add Insurance</Button>

        <Modal show={show} onHide={() => setShow(false)} animation={false}>
            {patient ?
            <>
            <Modal.Header><Modal.Title>Edit {patient.name}'s Info</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={patient.name} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" name="address" value={patient.address} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" name="phone_number" value={patient.phone_number} onChange={handleChange}/>
                    </Form.Group>      
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" name="email" value={patient.email} onChange={handleChange}/>
                    </Form.Group>
                    <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>         
                </Form>
            </Modal.Body> </> : null}
        </Modal>
        </div>
    )
}

export default Patient;