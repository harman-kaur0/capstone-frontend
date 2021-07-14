import {Button, Modal, Form, Col} from 'react-bootstrap';
import { useState } from "react";
import { useLocation } from "react-router-dom";


const InsuranceForm = ({setShow, show, insurance, setInsurance}) => {
    const location = useLocation();
    const patientId = parseInt(location.pathname.split("/admin/patient/")[1]); 
    const [nameError, setNameError] = useState("")
    const [NumberError, setNumberError] = useState("")
    const [groupError, setGroupError] = useState("")
    const [subName, setSubName] = useState("")

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
                if (data.error){
                    setNameError(data.error.name)
                    setNumberError(data.error.subscriber_number)
                    setSubName(data.error.subscriber_name)
                    setGroupError(data.error.group_number)
                }else {
                setInsurance([...insurance, data])
                setShow(false)
                setForm({})
                }
            })
    }

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        postInsurance({...form, patient_id: patientId})
    }

    const hideShow = () => {
        setShow(false)
        setForm({})
        setNameError("")
        setNumberError("")
        setSubName("")
        setGroupError("")
    }
   

    return(
        <>
        <Modal show={show} onHide={() => hideShow()} animation={false}>
            <Modal.Header closeButton><Modal.Title>Add Insurance Info</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Insurance Name</Form.Label>
                        <Form.Control type="text" name="name" value={form.name} onChange={handleChange}/>
                        {nameError ? <Form.Text type= "invalid" style={{color: "red"}}>{nameError}</Form.Text>: null}
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Subscriber Name</Form.Label>
                        <Form.Control type="text" name="subscriber_name" value={form.subscriber_name} onChange={handleChange}/>
                        {subName ? <Form.Text type= "invalid" style={{color: "red"}}>{subName}</Form.Text>: null}
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Subscriber Number</Form.Label>
                        <Form.Control type="text" name="subscriber_number" value={form.subscriber_number} onChange={handleChange}/>
                        {NumberError ? <Form.Text type= "invalid" style={{color: "red"}}>{NumberError}</Form.Text>: null}
                    </Form.Group>      
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                        <Form.Label>Group Number</Form.Label>
                        <Form.Control type="text" name="group_number" value={form.group_number} onChange={handleChange}/>
                        {groupError ? <Form.Text type= "invalid" style={{color: "red"}}>{groupError}</Form.Text>: null}
                    </Form.Group>
                    <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>         
                </Form>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default InsuranceForm;