import {Card, Table, Button, Modal, Form, Col} from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import InsuranceForm from "./InsuranceForm"
import PatientInsurance from "./PatientInsurance"
import PatientPrescriptions from "./PatientPrescriptions"
import PrescriptionForm from "./PrescriptionForm"
import NewApptForm from "./NewApptForm"
import Appointments from "./Appointments"


const Patient = ({user, newApptFormShow, setNewApptFormShow, appt, setAppt}) => {
    const history = useHistory()
    const [patient, setPatient] = useState(null);
    const [show, setShow] = useState(false);
    const [presShow, setPresShow] = useState(false)
    const [insShow, setInsShow] = useState(false)
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
            setPatient(data)
            setInsurance(data.insurances)
        })
            
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

    const deleteAppt = id => {
        fetch(`http://localhost:3000/appointments/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`, 
            }
        })
        let filterAppt = appt.filter(a => a.id !== id)
        setAppt(filterAppt)
    }

    const deletePrescription= (id) => {
        fetch(`http://localhost:3000/admin/prescriptions/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            }
        })
        let filterPres = patient.prescriptions.filter(p => p.id !== id)
        setPatient({...patient, prescriptions: filterPres})
    }

    const handleChange = e => {
        setPatient({...patient, [e.target.name]: e.target.value})
    }

    const handleSubmit = e => {
        e.preventDefault();
        setShow(false)
        editPatient(patientId, patient)
    }


    useEffect (() => {
        fetchPatient(patientId)
    }, [patientId])

    return (
        
        <div style={{marginTop: "100px"}}>
            <Card border="light" style={{width: "60rem", marginBottom: "30px"}}>
                {patient ?
                <Card.Body>
                    <Card.Title>{patient.name}  
                    <Button variant="dark" onClick={() => history.push("/admin/schedule")}>Doctor's Schedule</Button>
                    <Button variant="dark" onClick={() => setNewApptFormShow(true)}>Schedule an appointment</Button>
                    </Card.Title> 
                    <Table>
                        <td>
                            <Card.Text><strong>Date of Birth: </strong> {patient.date_of_birth}</Card.Text>
                            <Card.Text><b>Address:</b>  {patient.address}</Card.Text>
                            <Card.Text><b>Phone Number:</b>  {patient.phone_number}</Card.Text>
                            <Card.Text><b>Email:</b>  {patient.email}</Card.Text>
                            <Button variant="primary" onClick={() => setShow(true)}>Edit Info</Button>
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
        <Button variant="dark" onClick={() => setInsShow(true)}>Add Insurance</Button>
       

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
                    <Button style={{marginLeft: "42.5%"}} variant="success" type="Submit">Submit</Button>         
                </Form>
            </Modal.Body> </> : null}
        </Modal>
        <InsuranceForm show={insShow} setShow = {setInsShow} setInsurance={setInsurance} insurance={insurance}/> 
        {insurance ? insurance.map(i => <PatientInsurance insurance={i} key={i.id} insurances={insurance} setInsurance={setInsurance} deleteInsurance={deleteInsurance}/>) : null}
        <Card>
            <Card.Header><b>Appointments</b></Card.Header>
            {appt ? appt.map(a => <Appointments a={a} ket={a.id} appointments= {appt} setAppointments={setAppt} deleteAppt={deleteAppt}/>) : null}
        </Card>
        <Button variant="dark" onClick={() => setPresShow(true)}>Prescribe Medication</Button>
        <PrescriptionForm show={presShow} setShow = {setPresShow} setPatient={setPatient} user={user} patient={patient}/>
        {patient ? patient.prescriptions.map(p => <PatientPrescriptions p={p} key={p.id} deletePrescription={deletePrescription} setPatient={setPatient} user={user} patient={patient}/>) : null}
        <NewApptForm setAppt={setAppt} appt={appt} newApptFormShow={newApptFormShow} setNewApptFormShow={setNewApptFormShow}/>
    </div>
    )
}

export default withRouter(Patient);