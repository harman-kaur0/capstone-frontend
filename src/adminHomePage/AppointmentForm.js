import { Modal, Button, Form, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const AppointmentForm = ({formShow, setFormShow, setAppt, appt}) => {
    const [query, setQuery] = useState("")
    const [input, setInput] = useState("")
    const [results, setResults] = useState([])
    const [ptResults, setPtResults] = useState([])
    const [doctors, setDoctors] = useState([])
    const [patients, setPatients] = useState([])
    
    const [form, setForm] = useState({startDate: "", reason: "", endDate: ""})

    const onResults = (e) => {
        setQuery(e);
        setResults([]);
    }

    const onPtResults = e => {
        setInput(e)
        setPtResults([])
    }

    const fetchDoctors = () => {
        fetch("http://localhost:3000/admin/doctors", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
        .then(resp => resp.json())
        .then(data => {
            setDoctors(data)
        })
    }

    const fetchPatients = () => {
        fetch("http://localhost:3000/patients", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
        .then(resp => resp.json())
        .then(data => {
            setPatients(data)
        })
    }

    useEffect(() => {
        fetchDoctors()
        fetchPatients()
    }, [])

    const postAppt = obj => {
        fetch("http://localhost:3000/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            }, 
            body: JSON.stringify(obj)
        })
        .then(res => res.json())
        .then(data => {
            setAppt([...appt, data])
        })
    }

    const handleChange = (e) => {
        let matches = []
        if(e.target.value.length > 0) {
            matches = doctors.filter(d => d.name.toLowerCase().includes(e.target.value) || d.title.toLowerCase().includes(e.target.value)) 
        }
        setResults(matches)
        setQuery(e.target.value)
    }

    const patientHandleChange = (e) => {
        let matches = []
        if(e.target.value.length > 0) {
            matches = patients.filter(d => d.name.toLowerCase().includes(e.target.value) || d.date_of_birth.includes(e.target.value)) 
        }
        setPtResults(matches)
        setInput(e.target.value)
    }

    const formChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = e => {
        let startDate = new Date (form.startDate)
        let endDate = new Date (form.endDate)
        let doctor = doctors.find(d => d.name === query) 
        let patient = patients.find(p => p.name === input)
        e.preventDefault();
        let obj = {...form, employee_id: doctor.id, startDate: startDate, endDate: endDate, patient_id: patient.id}
        setFormShow(false)
        postAppt(obj)
     }

    return (
        <Modal show={formShow} onHide={() => setFormShow(false)} animation={false}>
            <Modal.Header closeButton></Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Find Patient</Form.Label>
                    <Form.Control type="search" value={input} 
                    placeholder="Search by name or date of birth" 
                    className="mr-2" aria-label="Search" 
                    onChange={patientHandleChange} 
                    onBlur={() => {setTimeout(() => {setPtResults([])}, 100)}}
                    autoComplete="off"/>
                    {ptResults && ptResults.map((r, i) => 
                        <div key={i} className="results col-md-12 justify-content-md-center" onClick={() => onPtResults(r.name, r.date_of_birth)}>{r.name}, {r.date_of_birth}</div>)}
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Find a Doctor</Form.Label>
                    <Form.Control type="search" value={query} 
                    placeholder="Search by name or title" 
                    className="mr-2" aria-label="Search" 
                    onChange={handleChange} 
                    onBlur={() => {setTimeout(() => {setResults([])}, 100)}}
                    autoComplete="off"/>
                    {results && results.map((r, i) => 
                        <div key={i} className="results col-md-12 justify-content-md-center" onClick={() => onResults(r.name, r.title)}>{r.name}, {r.title}</div>)}
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Choose Date and time</Form.Label><br/>
                    <b>Start Time</b><Form.Control type="datetime-local" name="startDate" value={form.startDate} onChange={formChange} />
                    <b>End Time</b><Form.Control type="datetime-local" name="endDate" value={form.endDate} onChange={formChange} />
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Reason for appointment</Form.Label>
                    <Form.Control as="textarea" style={{height: '100px'}} name="reason" value={form.reason} onChange={formChange} />
                </Form.Group> 
                <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>        
            </Form>
        </Modal>
    )
}

export default AppointmentForm;