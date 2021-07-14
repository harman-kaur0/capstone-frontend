import { Button, Modal, Form, Col, ListGroup} from 'react-bootstrap';
import { useState } from "react";


const PrescriptionForm = ({show, setShow, setPres, user, pres, patient}) => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([]);
    const [form, setForm] = useState({quantity: "", directions: "", notes: ""})
    const [nameError, setNameError] = useState("")
    const [directionsError, setDirectionsError] = useState("")
    const [quantityError, setQuanityError] = useState("")

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
                if (data.error){
                    setNameError(data.error.name)
                    setDirectionsError(data.error.directions)
                    setQuanityError(data.error.quantity)
                }else{
                    setPres([...pres, data])
                    setShow(false)
                }
                
            })
    }

    const formSubmit = (e) => {
        e.preventDefault();
        let obj = {...form, name: query, patient_id: patient.id, employee_id: user.id}
        postPrescription(obj)
        setForm({})
    }

    const handleChange = (e) => {
        setQuery(e.target.value)
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

    const formChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const hideShow = () => {
        setShow(false)
        setNameError("")
        setDirectionsError("")
        setQuanityError("")
        setForm({})
        setQuery("")
    }

    return (
        <div>
            <Modal show={show} onHide={() => hideShow()} animation={false}>
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
                {
                    query ?
                    <Form onSubmit={formSubmit}>
                        <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="text" name="quantity" value={form.quantity} onChange={formChange}/>
                            {quantityError ? <Form.Text type= "invalid" style={{color: "red"}}>{quantityError}</Form.Text>: null}
                        </Form.Group>
                        <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01">
                            <Form.Label>Directions</Form.Label>
                            <Form.Control name="directions" value={form.directions} onChange={formChange}/>
                            {directionsError ? <Form.Text type= "invalid" style={{color: "red"}}>{directionsError}</Form.Text>: null}
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