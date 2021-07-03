import {Card, Table, Button, Modal, Form, Col} from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import InsuranceForm from "./InsuranceForm"
import PatientInsurance from "./PatientInsurance"
import AppointmentForm from "./AppointmentForm"

const Patient = () => {
    const [patient, setPatient] = useState(null);
    const [show, setShow] = useState(false);
    const [insShow, setInsShow] = useState(false)
    const history = useHistory();
    const location = useLocation();
    const [insurance, setInsurance] = useState([])
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

    const fetchInsurance = id => {
        fetch(`http://localhost:3000/admin/insurances`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
        .then(resp => resp.json())
        .then(data => {
            let i = data.filter(i => i.patient_id !== id)
            setInsurance(i)})
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
            setPatient({...data, ...unedited})
        })    
    }

    const deleteInsurance= (id) => {
        fetch(`http://localhost:3000/admin/insurances/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            }
        })
        let filterIns = insurance.filter(i => i.id !== id)
        setInsurance(filterIns)
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
        fetchInsurance(patientId)
    }, [patientId])

    return (
        <div style={{marginTop: "100px"}}>
            <Card border="light" style={{width: "60rem", marginBottom: "30px"}}>
                {patient ?
                <Card.Body>
                    <Card.Title>{patient.name}  <Button variant="outline-primary">Make an Appointment</Button></Card.Title> 
                    <Table>
                        <td>
                            <Card.Text><strong>Date of Birth: </strong> {patient.date_of_birth}</Card.Text>
                            <Card.Text><b>Address:</b>  {patient.address}</Card.Text>
                            <Card.Text><b>Phone Number:</b>  {patient.phone_number}</Card.Text>
                            <Card.Text><b>Email:</b>  {patient.email}</Card.Text>
                            <Button variant="outline-primary" onClick={() => setShow(true)}>Edit Info</Button>
                        </td>
                        <td>
                            <Card.Text><b>Ethnicity:</b>  {patient.ethnicity}</Card.Text>
                            <Card.Text><b>Race:</b>  {patient.race}</Card.Text>
                            <Card.Text><b>Language:</b>  {patient.language}</Card.Text>
                        </td>

                    </Table>

                </Card.Body>: null
                }
        </Card>
        <Button variant="outline-primary" onClick={() => setInsShow(true)}>Add Insurance</Button>
        

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
        <InsuranceForm setShow={setInsShow} show={insShow} setInsurance={setInsurance} insurance={insurance}/>
        {insurance ? insurance.map(i => <PatientInsurance insurance={i} key={i.id} setShow={setInsShow}  insurances={insurance} setInsurance={setInsurance} deleteInsurance={deleteInsurance}/>) : null}
        <AppointmentForm patient ={patient}/>
        </div>
    )
}

export default Patient;