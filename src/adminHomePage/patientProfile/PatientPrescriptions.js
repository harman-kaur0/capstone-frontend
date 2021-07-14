import {Card, Button, Modal, Form, Col, CardGroup, ListGroup} from 'react-bootstrap';
import { useState } from "react";
import {FaRegEdit} from "react-icons/fa"
import {RiDeleteBinFill} from "react-icons/ri"

const PatientPrescriptions = ({p, deletePrescription, prescriptions, setPrescriptions}) => {
    const [delShow, setDelShow] = useState(false)
    const [updateShow, setUpdateShow] = useState(false)
    const [pres, setPres] = useState(p)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([]);

    const handleDelete = () => {
        deletePrescription(pres.id)
        setDelShow(false)
    }

    const onResults = (e) => {
        setQuery(e);
        setResults([]);
        setPres({...pres, name: e})
       
    }

    const patchPres = (obj, id) => {
        fetch(`http://localhost:3000/admin/prescriptions/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(obj)
        })
        .then(res => res.json())
        .then(data => {
            let pres = prescriptions.map(p => p.id === data.id ? data : p)
            setPrescriptions( pres)
        })
    }

    const handleChange = (e) => {
        setQuery( e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault();
        fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${query}`)
            .then(resp => resp.json())
            .then(data => { 
                let obj = data.drugGroup.conceptGroup
                obj ? setResults(obj[obj.length - 1].conceptProperties) : setResults(["no results found"])
            })
        
    }

    const formChange = e => {
        setPres({...pres, [e.target.name]: e.target.value})   
    }

    const formSubmit = e => {
        let obj = {...pres, name: query}
        e.preventDefault();
        setUpdateShow(false);
        patchPres(obj, pres.id)
    }


    return (
        <div>
            <CardGroup>
            <Card border="light" style={{width: "30%", marginBottom: "30px", minWidth: "250px"}}>
                <Card.Body>
                    <Card.Title>{pres.name}</Card.Title> 
                        <Card.Text><b>Quantity: </b> {pres.quantity}</Card.Text>
                        <Card.Text><b>Directions:</b> {pres.directions}</Card.Text>
                        <Card.Text><b>Notes:</b> {pres.notes.length ? pres.notes : "not entered"}</Card.Text> 
                        <Card.Text><b>Prescribed by :</b>{pres.employee.name}</Card.Text>
                </Card.Body>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Button onClick={() => setUpdateShow(true)} variant="success" style={{marginRight: "5px"}}><FaRegEdit/></Button>
                    <Button variant="danger" onClick={() => setDelShow(true)}><RiDeleteBinFill/></Button>
                </div>
            </Card> 
        </CardGroup>

        <Modal show={delShow} onHide={() => setDelShow(false)} animation={false} keyboard={false} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to delete patient's prescription?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="primary" onClick={() => setDelShow(false)}>No</Button>
                <Button variant="danger" onClick={() => handleDelete()}>Yes</Button>
            </Modal.Footer>
        </Modal>

        <Modal show={updateShow} onHide={() => setUpdateShow(false)} animation={false}>
                <Modal.Header closeButton></Modal.Header>
                <Form onSubmit={handleSubmit} style={{marginBottom: '20px', marginTop: "5px"}}>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>type and hit enter</Form.Label>
                    <Form.Control type="search" value={query} 
                    placeholder="search for prescription" 
                    className="mr-2" aria-label="Search"
                    name="query"
                    onChange={handleChange}
                    autoComplete="off"
                    onBlur={() => {setTimeout(() => {setResults([])}, 100)}}
                    />
                    <ListGroup variant="flush">
                        {results.map((p,idx) => p.name ? <ListGroup.Item key={idx} onClick={() => onResults(p.name)}>{p.name}</ListGroup.Item> : p)}
                    </ListGroup>
                    
                </Form.Group>
                
                </Form>
                
                <Form onSubmit={formSubmit}>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                        <Form.Label><b style={{fontSize: '20px'}}>{pres.name}</b></Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="text" name="quantity" value={pres.quantity} onChange={formChange}/>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                        <Form.Label>Directions</Form.Label>
                        <Form.Control name="directions" value={pres.directions} onChange={formChange}/>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control as="textarea" name="notes" value={pres.notes} onChange={formChange}/>
                    </Form.Group>
                    <Button style={{marginLeft: "42.5%", marginBottom: "20px"}} variant="success" type="Submit">Submit</Button>      
                </Form>

            </Modal>
        </div>
    )
}

export default PatientPrescriptions;