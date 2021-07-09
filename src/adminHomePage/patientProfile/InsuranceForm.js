import {Button, Modal, Form, Col} from 'react-bootstrap';
import { useState } from "react";
import { useLocation } from "react-router-dom";


const InsuranceForm = ({setShow, show, insurance, setInsurance}) => {
    const location = useLocation();
    const patientId = parseInt(location.pathname.split("/admin/patient/")[1]); 
    const [form, setForm] = useState({name: "", subscriber_name: "", subscriber_number: "", group_number: ""})

    const postInsurance = (obj) => {
        fetch('http://localhost:3000/admin/insurances', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(obj)
        })
            .then((res) => res.json())
            .then(data => {
                setInsurance([...insurance, data])
            })
    }

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setShow(false);
        postInsurance({...form, patient_id: patientId})
    }
   

    return(
        <>
        <Modal show={show} onHide={() => setShow(false)} animation={false}>
            <Modal.Header><Modal.Title>Add Insurance Info</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Insurance Name</Form.Label>
                        <Form.Control type="text" name="name" value={form.name} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Subscriber Name</Form.Label>
                        <Form.Control type="text" name="subscriber_name" value={form.subscriber_name} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Subscriber Number</Form.Label>
                        <Form.Control type="text" name="subscriber_number" value={form.subscriber_number} onChange={handleChange}/>
                    </Form.Group>      
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                        <Form.Label>Group Number</Form.Label>
                        <Form.Control type="text" name="group_number" value={form.group_number} onChange={handleChange}/>
                    </Form.Group>
                    <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>         
                </Form>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default InsuranceForm;