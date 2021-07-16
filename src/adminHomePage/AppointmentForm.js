import { Modal, Button, Form, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

const AppointmentForm = ({formShow, setFormShow, setAppt, appt}) => {
    const [query, setQuery] = useState("")
    const history = useHistory()
    const [input, setInput] = useState("")
    const [results, setResults] = useState([])
    const [ptResults, setPtResults] = useState([])
    const [doctors, setDoctors] = useState([])
    const [patients, setPatients] = useState([])
    const [empError, setEmpError] = useState("")
    const [startError, setStartError] = useState("")
    const [endError, setEndError] = useState("")
    const [reasonError, setReasonError] = useState("")
    const [ptError, setPtError] = useState("")
    
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
            if(data.error){
                setEmpError(data.error.employee)
                setStartError(data.error.startDate)
                setEndError(data.error.endDate)
                setReasonError(data.error.reason)
                setPtError(data.error.patient)
            }else {
                setAppt([...appt, data])
                setFormShow(false)
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
        console.log(query)
        console.log(matches)
    }

    const patientHandleChange = (e) => {
        let matches = []
        if(e.target.value.length > 0) {
            matches =  patients.filter(d => d.name.toLowerCase().includes(e.target.value) || d.date_of_birth.includes(e.target.value))
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
        let obj = {...form, startDate: startDate, endDate: endDate, employee_id: doctor.id, patient_id: patient.id} 
        patient && doctor ? postAppt(obj) : console.log()
     }

     const hideShow = () => {
        setFormShow(false)
        setQuery("")
        setInput("")
        setForm({})
        setEmpError("")
        setStartError("")
        setEndError("")
        setReasonError("")
        setPtError("")
     }

    return (
        <Modal show={formShow} onHide={() => hideShow()} animation={false}>
            <Modal.Header closeButton></Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Find Patient</Form.Label>
                    <Form.Control type="search" value={input} 
                    placeholder="Search by name or date of birth" 
                    className="mr-2" aria-label="Search" 
                    onChange={patientHandleChange}
                    onBlur={() => {setTimeout(() => {setPtResults([])}, 100)}}
                    autoComplete="off" required/>
                    {ptError ? <Form.Text type= "invalid" style={{color: "red"}}>{ptError}</Form.Text> : null}
                    {ptResults && ptResults.map((r, i) => 
                       r ? <div key={i} className="results col-md-12 justify-content-md-center" onClick={() => onPtResults(r.name)} style={{fontSize: "20px"}}>{r.name}, {r.date_of_birth}</div> : r)}
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Find a Doctor</Form.Label>
                    <Form.Control type="search" value={query} 
                    placeholder="Search by name or title" 
                    className="mr-2" aria-label="Search" 
                    onChange={handleChange} 
                    onBlur={() => {setTimeout(() => {setResults([])}, 100)}}
                    autoComplete="off" required/>
                    {empError ? <Form.Text type= "invalid" style={{color: "red"}}>{empError}</Form.Text> : null}
                    {results && results.map((r, i) => 
                       r ? <div key={i} className="results col-md-12 justify-content-md-center" onClick={() => onResults(r.name)} style={{fontSize: "20px"}}>{r.name}, {r.title}</div> : r)}
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
                <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>        
            </Form>
        </Modal>
    )
}

export default AppointmentForm;