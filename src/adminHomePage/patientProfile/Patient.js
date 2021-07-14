import {Card, Table, Button, Modal, Form, Col, Row} from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import InsuranceForm from "./InsuranceForm"
import PatientInsurance from "./PatientInsurance"
import PatientPrescriptions from "./PatientPrescriptions"
import PrescriptionForm from "./PrescriptionForm"
import NewApptForm from "./NewApptForm"
import Appointments from "./Appointments"
import {FaUserEdit} from "react-icons/fa"
import {AiOutlineSchedule} from 'react-icons/ai'
import {GrScheduleNew} from 'react-icons/gr'
import {BsFillPlusCircleFill, BsPersonLinesFill} from 'react-icons/bs'
import {IoIosAddCircleOutline} from 'react-icons/io'
import {FiUpload} from "react-icons/fi"
import Schedule from "./Schedule"


const Patient = ({user, newApptFormShow, setNewApptFormShow, appt, setAppt}) => {
    const history = useHistory()
    const [patient, setPatient] = useState(null);
    const [show, setShow] = useState(false);
    const [presShow, setPresShow] = useState(false)
    const [insShow, setInsShow] = useState(false)
    const location = useLocation();
    const [insurance, setInsurance] = useState([])
    const [pres, setPres] = useState([])
    const [scheduleShow, setScheduleShow] = useState(false)
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
            setPres(data.prescriptions)
        })
            
    }

    const editPatient = (id, p) => {
        fetch(`http://localhost:3000/patients/${id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(p)
        })
        .then(resp => resp.json())
        .then(data => {
            setPatient(data)
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
        let filterPres = pres.filter(p => p.id !== id)
        setPres(filterPres)
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
        
        <div style={{marginTop: "100px", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "80%"}}>
                <div style={{marginRight: "20px", width: "60%"}}>
                    <Card border="light" style={{marginBottom: "30px"}}>
                        {patient ?
                        <Card.Body>
                            <Card.Title style={{color: "rgb(97, 97, 212)"}}>
                                <BsPersonLinesFill size="30px" marginLeft="20px"/> {patient.name}  
                            </Card.Title> 
                            <Table>
                                <td>
                                    <Card.Text><strong>Date of Birth: </strong> {patient.date_of_birth}</Card.Text>
                                    <Card.Text><b>Address:</b>  {patient.address ? patient.address : "not entered"}</Card.Text>
                                    <Card.Text><b>Phone Number:</b>  {patient.phone_number}</Card.Text>
                                    <Card.Text><b>Email:</b>  {patient.email ? patient.email : "not entered"}</Card.Text>
                                    <Button variant="success" onClick={() => setShow(true)}><FaUserEdit/></Button>
                                </td>
                                <td>
                                    <Card.Text><b>Ethnicity:</b>  {patient.ethnicity ? patient.ethnicity : "not entered"}</Card.Text>
                                    <Card.Text><b>Race:</b>  {patient.race ? patient.race : "not entered"}</Card.Text>
                                    <Card.Text><b>Language:</b>  {patient.language ? patient.language : "not entered"}</Card.Text>
                                </td>

                            </Table>

                        </Card.Body>: null
                        }
                    </Card>
            </div>
        <div style={{display: "flex", flexDirection: "column", width:  "40%", alignItems: "center"}}>
            <Button 
                style={{color: "black", marginBottom: "20px", fontSize: "10px", width: "135px", backgroundColor: "rgb(97, 97, 212)"}}
                onClick={() => setScheduleShow(true)}><AiOutlineSchedule/> VIEW SCHEDULE
            </Button>
            <Button onClick={() => setNewApptFormShow(true)} style={{marginBottom: "20px", color: "black", fontSize: "10px", width: "135px", backgroundColor: "rgb(97, 97, 212)"}}><GrScheduleNew/> ADD APPOINTMENT</Button>
            <Button onClick={() => setInsShow(true)} style={{color: "black", marginBottom: "20px", fontSize: "10px", width: "135px", backgroundColor: "rgb(97, 97, 212)"}}><IoIosAddCircleOutline/> INSURANCE</Button>
            <Button onClick={() => setPresShow(true)} style={{color: "black", marginBottom: "20px", fontSize: "10px", width: "135px", backgroundColor: "rgb(97, 97, 212)"}}><IoIosAddCircleOutline/> MEDICATIONS</Button>
            <Button style={{color: "black", marginBottom: "20px", fontSize: "10px", width: "135px", backgroundColor: "rgb(97, 97, 212)"}}><IoIosAddCircleOutline/> IMMUNIZATIONS</Button>
            <Button style={{color: "black", marginBottom: "20px", fontSize: "10px", width: "135px", backgroundColor: "rgb(97, 97, 212)"}}><FiUpload/> LAB RESULTS </Button>
        </div>
        </div>
       

        <Modal show={show} onHide={() => setShow(false)} animation={false}>
            {patient ?
            <>
            <Modal.Header closeButton><Modal.Title>Edit {patient.name}'s Info</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                <Row className="mb-2" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>  
                    <Form.Group as={Col} md="4" controlId="validationCustom01" >
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={patient.name} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name="date_of_birth" value={patient.date_of_birth} onChange={handleChange} style={{width: "160px"}} />           
                    </Form.Group>
                </Row>
                <Row className="mb-2" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                        <Form.Label>Ethnicity</Form.Label>
                        <select name="ethnicity" onChange={handleChange} value={patient.ethnicity}>
                            <option selected>Choose...</option>
                            <option value="Hispanic or Latino">Hispanic or Latino</option>
                            <option value="Not Hispanic or Latino">Not Hispanic or Latino</option>
                        </select>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="validationCustom05">
                        <Form.Label>Language</Form.Label>
                        <select name="language" onChange={handleChange} value={patient.language}>
                            <option selected>Choose...</option>
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="Korean">Korean</option>
                        </select>
                    </Form.Group>
                </Row>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom04" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Form.Label>Race</Form.Label>
                    <select name="race" onChange={handleChange} value={patient.race}>
                        <option >Choose...</option>
                        <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
                        <option value="Asian">Asian</option>
                        <option value="Black or African American">Black or African American</option>
                        <option value="Hispanic or Latino">Hispanic or Latino</option>
                        <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
                        <option value="White">White</option>
                    </select>
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
        {insurance.length ? 
            <Card style={{display: "flex", width: "80%", justifyContent: "space-around", flexWrap: "wrap", flexDirection: "column", marginBottom: "10px"}}>
                <Card.Body>
                    <Card.Header style={{textAlign: "center", color: "rgb(97, 97, 212)", fontSize: "20px", fontWeight: "bold", marginBottom : "10px"}}><BsFillPlusCircleFill size="22px" marginLeft="20px" cursor="pointer" onClick={() => setInsShow(true)}/> INSURANCE INFO</Card.Header>
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around"}}>
                        {insurance.map(i => <PatientInsurance insurance={i} key={i.id} insurances={insurance} setInsurance={setInsurance} deleteInsurance={deleteInsurance}/>)}
                    </div> 
                </Card.Body>
            </Card>
        : null}
        {appt.filter(a => a.patient.id === patientId).length ?
        <Card style={{display: "flex", width: "80%", flexWrap: "wrap", flexDirection: "column", marginTop: "30px", marginBottom: "10px"}}>
                <Card.Header style={{textAlign: "center", color: "rgb(97, 97, 212)", fontSize: "20px", fontWeight: "bold", marginBottom : "10px"}}>
                    <BsFillPlusCircleFill size="22px" marginLeft="20px" cursor="pointer" onClick={() => setNewApptFormShow(true)}/> APPOINTMENTS
                </Card.Header>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    {appt.filter(a => a.patient.id === patientId).map(a => <Appointments a={a} ket={a.id} appointments= {appt} setAppointments={setAppt} deleteAppt={deleteAppt}/>)}
                </div>
        </Card>
        : null}
        <PrescriptionForm show={presShow} setShow = {setPresShow} setPres={setPres} user={user} pres={pres} patient={patient}/>
        {pres.length ? 
        <Card style={{display: "flex", width: "80%", justifyContent: "space-around", flexWrap: "wrap", flexDirection: "column", marginTop: "30px", marginBottom: "10px"}}>
            <Card.Header style={{textAlign: "center", color: "rgb(97, 97, 212)", fontSize: "20px", fontWeight: "bold", marginBottom : "10px"}}>
                    <BsFillPlusCircleFill size="22px" marginLeft="20px" cursor="pointer" onClick={() => setPresShow(true)}/> MEDICATIONS
            </Card.Header>
            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around"}}>
                {pres.map(p => <PatientPrescriptions p={p} key={p.id} deletePrescription={deletePrescription} setPrescriptions={setPres} user={user} prescriptions={pres}/>)}
            </div>
        </Card> 
        : null}
        <NewApptForm setAppt={setAppt} appt={appt} newApptFormShow={newApptFormShow} setNewApptFormShow={setNewApptFormShow}/>
        <Schedule show={scheduleShow} setShow={setScheduleShow} appt={appt}/>
    </div>
    )
}

export default withRouter(Patient);