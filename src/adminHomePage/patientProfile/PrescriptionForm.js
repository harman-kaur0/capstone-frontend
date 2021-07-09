import { Button, Modal, Form, Col, ListGroup} from 'react-bootstrap';
import { useState } from "react";


const PrescriptionForm = ({show, setShow, setPatient, user, patient}) => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([]);
    // const patientId = parseInt(location.pathname.split("/admin/patient/")[1]); 
    const [form, setForm] = useState({quantity: "", directions: "", notes: ""})

    const onResults = (e) => {
        setQuery(e);
        setResults([]);
    }
    
    const postPrescription = (obj) => {
        fetch('http://localhost:3000/admin/prescriptions', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(obj)
        })
            .then((res) => res.json())
            .then(data => {
                setPatient({...patient, prescriptions: [...patient.prescriptions, data]})
            })
    }

    const formSubmit = (e) => {
        e.preventDefault();
        let obj = {...form, name: query, patient_id: patient.id, employee_id: user.id}
        setShow(false)
        postPrescription(obj)
    }

    const handleChange = (e) => {
        setQuery(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault();
        fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${query}`)
            .then(resp => resp.json())
            .then(data => { setResults(data.drugGroup.conceptGroup)})
    }

    const formChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <Modal show={show} onHide={() => setShow(false)} animation={false}>
                <Modal.Header closeButton></Modal.Header>
                <Form onSubmit={handleSubmit} style={{marginBottom: '20px', marginTop: "5px"}}>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>type and hit enter</Form.Label>
                    <Form.Control type="search" value={query} 
                    placeholder="search for prescription" 
                    className="mr-2" aria-label="Search"
                    name="query"
                    onChange={handleChange}
                    onBlur={() => {setTimeout(() => {setResults([])}, 100)}}
                    />
                    {results.length ? <ListGroup variant="flush">
                        {results[results.length - 1].conceptProperties.map((p,idx) => <ListGroup.Item key={idx} onClick={() => onResults(p.name)}>{p.name}</ListGroup.Item>)}
                        </ListGroup>: null}
                    
                </Form.Group>

                </Form>
                {
                    query ?
                    <Form onSubmit={formSubmit}>
                        <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="text" name="quantity" value={form.quantity} onChange={formChange}/>
                        </Form.Group>
                        <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                            <Form.Label>Directions</Form.Label>
                            <Form.Control name="directions" value={form.directions} onChange={formChange}/>
                        </Form.Group>
                        <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                            <Form.Label>Notes</Form.Label>
                            <Form.Control as="textarea" name="notes" value={form.notes} onChange={formChange}/>
                        </Form.Group>
                        <Button style={{marginLeft: "42.5%", marginBottom: "20px"}} variant="success" type="Submit">Submit</Button>      
                    </Form>
                    :null
                }
            </Modal>
        </div>
    )
}

export default PrescriptionForm;