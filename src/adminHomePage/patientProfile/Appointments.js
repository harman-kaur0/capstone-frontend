import { Modal, Button, Form, Col, ListGroup, Card} from 'react-bootstrap';
import { useState } from "react";
import { useLocation } from "react-router-dom";

const Appointments = ({a, deleteAppt, appointments, setAppointments}) => {
    const [delShow, setDelShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const location = useLocation();
    const [appt, setAppt] = useState(a)

    const handleDelete = () => {
        deleteAppt(appt.id)
        setDelShow(false)
    }

    const patchAppt = (obj, id) => {
        fetch(`http://localhost:3000/appointments/${id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(obj)
        })
            .then((res) => res.json())
            .then(data => {
             let apt = appointments.map(a => a.id === data.id ? data : a)
                setAppointments(apt)
            })
    }

    const formChange = (e) => {
        setAppt({...appt, [e.target.name]: e.target.value})
    }

    const handleSubmit = e => {
        let startDate = new Date (appt.startDate)
        let endDate = new Date (appt.endDate)
         e.preventDefault();
         setUpdateShow(false)
         patchAppt({...appt, 
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString(),
        }, appt.id)
     }

     const changeDate = str => {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2),
            hrs = ("0" + date.getHours()).slice(-2),
            mins = ("0" + date.getMinutes()).slice(-2)
        return `${[date.getFullYear(), mnth, day].join("-")}T${hrs}:${mins}`
    }



    const convert = str => {
        var date = new Date(str)
        return date.toLocaleString([], {month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})
    }
    return (
        <div>              
            <ListGroup>
                <ListGroup.Item><b>{appt.employee.name},  
                Date and Time: </b>{convert(appt.startDate)}  
                <Button onClick={() => setUpdateShow(true)}>MAKE CHANGES</Button>
                <Button variant='danger' onClick={() => setDelShow(true)}>CANCEL</Button>
                </ListGroup.Item>
            </ListGroup>

            <Modal show={delShow} onHide={() => setDelShow(false)} animation={false} keyboard={false} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete the appointment?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setDelShow(false)}>No</Button>
                    <Button variant="danger" onClick={() => handleDelete()}>Yes</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={updateShow} onHide={() => setUpdateShow(false)} animation={false}>
            <Modal.Header closeButton></Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                        <Form.Label><b style={{fontSize: '20px'}}>{appt.employee.name}</b></Form.Label>
                    </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Choose Date and time</Form.Label><br/>
                    <b>Start Time</b><Form.Control type="datetime-local" name="startDate" value={changeDate(appt.startDate)} onChange={formChange} />
                    <b>End Time</b><Form.Control type="datetime-local" name="endDate" value={changeDate(appt.endDate)} onChange={formChange} />
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Reason for appointment</Form.Label>
                    <Form.Control as="textarea" style={{height: '100px'}} name="reason" value={appt.reason} onChange={formChange} />
                </Form.Group> 
                <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>        
            </Form>
        </Modal>
        </div>
    )
}

export default Appointments;