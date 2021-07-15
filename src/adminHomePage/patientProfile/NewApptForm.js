import { Modal, Button, Form, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

const NewApptForm = ({newApptFormShow, setNewApptFormShow, setAppt, appt}) => {
    const [query, setQuery] = useState("")
    const location = useLocation();
    const [results, setResults] = useState([])
    const [doctors, setDoctors] = useState([])
    const [empError, setEmpError] = useState("")
    const [startError, setStartError] = useState("")
    const [endError, setEndError] = useState("")
    const [reasonError, setReasonError] = useState("")
    
    const [form, setForm] = useState({startDate: "", reason: "", endDate: ""})
    const patientId = parseInt(location.pathname.split("/admin/patient/")[1]); 

    const onResults = (e) => {
        setQuery(e);
        setResults([]);
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

    useEffect(() => {
        fetchDoctors()
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
            if(data.error){
                setEmpError(data.error.employee)
                setStartError(data.error.startDate)
                setEndError(data.error.endDate)
                setReasonError(data.error.reason)
            }else {
                setAppt([...appt, data])
                setNewApptFormShow(false)
                setForm({})
            }
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

    const formChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = e => {
        let startDate = new Date (form.startDate)
        let endDate = new Date (form.endDate)
        let doctor = doctors.find(d => d.name === query)
        e.preventDefault();
        doctor ? postAppt({...form, startDate: startDate, endDate: endDate, patient_id: patientId, employee_id: doctor.id}) : console.log()
     }
     const hideShow = () => {
        setNewApptFormShow(false)
        setQuery("")
        setForm({})
        setEmpError("")
        setStartError("")
        setEndError("")
        setReasonError("")
     }

    return (
        <Modal show={newApptFormShow} onHide={() => hideShow()} animation={false}>
            <Modal.Header closeButton></Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Find a Doctor</Form.Label>
                    <Form.Control type="search" value={query} 
                        placeholder="search by name or title..." 
                        className="mr-2" aria-label="Search" 
                        onChange={handleChange} 
                        onBlur={() => {setTimeout(() => {setResults([])}, 100)}}
                        autoComplete="off" required/>
                    {empError ? <Form.Text type= "invalid" style={{color: "red"}}>{empError}</Form.Text> : null}
                    {results && results.map((r, i) => 
                        <div key={i} className="results col-md-12 justify-content-md-center" onClick={() => onResults(r.name, r.title)} style={{fontSize: "20px"}}>{r.name}, {r.title}</div>)
                    }
                            
                    
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <b>Start Time</b><Form.Control type="datetime-local" name="startDate" value={form.startDate} onChange={formChange} />
                    {startError ? <Form.Text type= "invalid" style={{color: "red"}}>{startError}</Form.Text>: null}
                    <b>End Time</b><Form.Control type="datetime-local" name="endDate" value={form.endDate} onChange={formChange} />
                    {endError ? <Form.Text type= "invalid" style={{color: "red"}}>{endError}</Form.Text>: null}
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Reason for appointment</Form.Label>
                    <Form.Control as="textarea" style={{height: '100px'}} name="reason" value={form.reason} onChange={formChange} />
                    {reasonError ? <Form.Text type= "invalid" style={{color: "red"}}>{reasonError}</Form.Text>: null}
                </Form.Group> 
                <Button style={{marginLeft: "42.5%", marginBottom: "5px"}} variant="outline-success" type="Submit">Submit</Button>        
            </Form>
        </Modal>
    )
}

export default NewApptForm;