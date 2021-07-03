import {Card, Button, Modal, Form, Col} from 'react-bootstrap';
import { useState } from "react";

const PatientInsurance = ({insurance, setShow, deleteInsurance, setInsurance, insurances}) => {
    const [delShow, setDelShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [ins, setIns] = useState(insurance)


    const handleDelete = () => {
        deleteInsurance(ins.id)
        setDelShow(false)
    }

    const patchInsurance = (obj, id) => {
        fetch(`http://localhost:3000/admin/insurances/${id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(obj)
        })
            .then((res) => res.json())
            .then(data => {
             let ins = insurances.map(i => i.id === data.id ? data : i)
                setInsurance(ins)
            })
    }

    const handleChange = (e) => {
        setIns({...ins, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setUpdateShow(false);
        patchInsurance(ins, ins.id)
    }
   
    return (
        <>
            <Card border="light" style={{width: "60rem", marginBottom: "30px"}}>
                <Card.Body>
                    <Card.Title>{ins.name}</Card.Title> 
                        <Card.Text><b> Subscriber Name: </b> {ins.subscriber_name}</Card.Text>
                        <Card.Text><b>Subscriber Number:</b>  {ins.subscriber_number}</Card.Text>
                        <Card.Text><b>Group Number:</b>  {ins.group_number}</Card.Text>
                        <Button variant="outline-primary" onClick={() => setUpdateShow(true)}>UPDATE</Button>
                        <Button variant="outline-primary" onClick={() => setDelShow(true)}>DELETE</Button>
                </Card.Body>
            </Card> 

            {/* modal to delete insurance */}

            <Modal show={delShow} onHide={() => setDelShow(false)} animation={false} keyboard={false} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete patient's insurance?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setDelShow(false)}>No</Button>
                    <Button variant="danger" onClick={() => handleDelete()}>Yes</Button>
                </Modal.Footer>
            </Modal>

            {/* //form for updating insurance */}

            <Modal show={updateShow} onHide={() => setUpdateShow(false)} animation={false}>
            <Modal.Header><Modal.Title>Update Insurance Info</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Insurance Name</Form.Label>
                        <Form.Control type="text" name="name" value={ins.name} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Subscriber Name</Form.Label>
                        <Form.Control type="text" name="subscriber_name" value={ins.subscriber_name} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Subscriber Number</Form.Label>
                        <Form.Control type="text" name="subscriber_number" value={ins.subscriber_number} onChange={handleChange}/>
                    </Form.Group>      
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                        <Form.Label>Group Number</Form.Label>
                        <Form.Control type="text" name="group_number" value={ins.group_number} onChange={handleChange}/>
                    </Form.Group>
                    <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>         
                </Form>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default PatientInsurance;