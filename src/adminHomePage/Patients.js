import {Button, Modal, Form, Col, Row, DropdownButton, Dropdown} from 'react-bootstrap';
import {useEffect, useState} from 'react'
import PatientsList from "./patientsPage/PatientsList"
import { DropDownButton } from 'devextreme-react';


const Patients = () => {

    const [show, setShow] = useState(false);
    const [patients, setPatients] = useState([]);
    const [nameError, setNameError] = useState("")
    const [dobError, setDobError] = useState("")
    const [addressError, setAddressError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [ethnicityError, setEthnicityError] = useState("")
    const [raceError, setRaceError] = useState("")
    const [languageError, setLanguageError] = useState("")

    const [form, setForm] = useState({name:"", date_of_birth:"", address:"", phone_number:"", ethicity:"", race:"", email:"", language:""})

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }
    
    const fetchPatients = () => {
        fetch('http://localhost:3000/patients', {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
            .then((res) => res.json())
            .then(data => {
                setPatients(data)
            })
    }

    const postPatients = (obj) => {
        fetch('http://localhost:3000/patients', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(obj)
        })
            .then((res) => res.json())
            .then(data => {
                if(data.error){
                    setAddressError(data.error.address)
                    setDobError(data.error.date_of_birth)
                    setEthnicityError(data.error.ethicity)
                    setLanguageError(data.error.language)
                    setNameError(data.error.name)
                    setPhoneError(data.error.phone_number)
                    setRaceError(data.error.race)
                }else{
                    setPatients([...patients, data])
                    setShow(false)
                }
            })
    }

    useEffect(() => {
        fetchPatients();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        postPatients(form);
    }

    return (
        <div>
            <div className="add-patient">
                <Button style={{"marginTop": "100px"}} variant="outline-primary" onClick={() => setShow(true)}>Add a new patient</Button>
                {patients.map(p => <PatientsList patient={p} key={p.id}/>)}
            </div>
            <Modal show={show} onHide={() => setShow(false)} animation={false}>
                <Modal.Header closeButton> 
                    <Modal.Title>New Patient Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-2" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>  
                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={form.name} onChange={handleChange} style={{width: "160px"}}/>
                                {nameError ? <Form.Text type= "invalid" style={{color: "red"}}>{nameError}</Form.Text>: null}
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustom02">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} style={{width: "160px"}} />
                                {dobError ? <Form.Text type= "invalid" style={{color: "red"}}>{dobError}</Form.Text>: null}
                            </Form.Group>
                        </Row>

                        <Row className="mb-2" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Form.Group as={Col} md="4" controlId="validationCustom03">
                                <Form.Label>Ethnicity</Form.Label>
                                <select name="ethnicity" onChange={handleChange}>
                                    <option selected>Choose...</option>
                                    <option value="Hispanic or Latino">Hispanic or Latino</option>
                                    <option value="Not Hispanic or Latino">Not Hispanic or Latino</option>
                                </select>
                                {ethnicityError ? <Form.Text type= "invalid" style={{color: "red"}}>{ethnicityError}</Form.Text>: null}
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="validationCustom05">
                                <Form.Label>Language</Form.Label>
                                <select name="language" onChange={handleChange}>
                                    <option selected>Choose...</option>
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="Chinese">Chinese</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Vietnamese">Vietnamese</option>
                                    <option value="Korean">Korean</option>
                                </select>
                                {languageError ? <Form.Text type= "invalid" style={{color: "red"}}>{languageError}</Form.Text>: null}
                            </Form.Group>


                        </Row>
                            <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom04" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Form.Label>Race</Form.Label>
                                <select name="race" onChange={handleChange}>
                                    <option >Choose...</option>
                                    <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
                                    <option value="Asian">Asian</option>
                                    <option value="Black or African American">Black or African American</option>
                                    <option value="Hispanic or Latino">Hispanic or Latino</option>
                                    <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
                                    <option value="White">White</option>
                                </select>
                                {raceError ? <Form.Text type= "invalid" style={{color: "red"}}>{raceError}</Form.Text>: null}
                            </Form.Group>

                            <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom06">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" name="address" value={form.address} onChange={handleChange}/>
                                {addressError ? <Form.Text type= "invalid" style={{color: "red"}}>{addressError}</Form.Text>: null}
                            </Form.Group>
                            <Row className="mb-2" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Form.Group as={Col} md="4" controlId="validationCustom07">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="phone_number" value={form.phone_number} onChange={handleChange}/>
                                    <Form.Text>Format: 123-456-7890</Form.Text>
                                    {phoneError ? <Form.Text type= "invalid" style={{color: "red"}}>{phoneError}</Form.Text>: null}
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="validationCustom08">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" name="email" value={form.email} onChange={handleChange}/>
                                </Form.Group>
                            </Row>
                        <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal> 
        </div>

    )
}
export default Patients;