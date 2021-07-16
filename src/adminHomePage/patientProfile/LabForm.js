import {Button, Modal, Form, Col} from 'react-bootstrap';
import { useState } from "react";
import {storage} from "./Firebase"

const LabForm = ({show, setShow, patient, labResults, setLabResults, doctors}) => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [form, setForm] = useState({name: "", date: ""})
    const [file, setFile] = useState(null)
    const [errors, setErrors] = useState([])
    const [nameError, setNameError] = useState("")
    const [dateError, setDateError] = useState("")
    const [URLError, setURLError] = useState("")

    const handleChange = e => {
        setForm ({...form, [e.target.name]: e.target.value})
    }

    const onResults = (e) => {
        setQuery(e);
        setResults([]);
    }

    const handleFile = e => {
        const selectedFile = e.target.files[0]
        const fileExt = "application/pdf"
        const newErr = []
        if (selectedFile.type !== fileExt){
            newErr.push("file must be a pdf file")
            setFile(null)
        }else {
            setFile(selectedFile)
        }
        setErrors(newErr)
    }

    const doctorChange = (e) => {
        let matches = []
        if(e.target.value.length > 0) {
            matches = doctors ? doctors.filter(d => d.name.toLowerCase().includes(e.target.value) || d.title.toLowerCase().includes(e.target.value)) : null
        }
            setResults(matches)
            setQuery(e.target.value)
    }

    const fileName = file ? `${file.name.split(".pdf")[0]}_${form.date}.pdf` : null

    const handleSubmit = e => {
        e.preventDefault()
        const uploadTask = storage.ref(`labresults/${fileName}`).put(file)
        uploadTask.on('state_changed',
            snapshot => {},
            error => { 
                const newErrors = []
                newErrors.push(error)
                setErrors(newErrors)
            }, () => {
                storage.ref('labresults').child(`${fileName}`)
                .getDownloadURL()
                .then(url => {
                    console.log(url)
                    postLabResults(url)
                })
            }
        )
            
    }

    const hideShow = () => {
        setShow(false)
        setForm({})
        setFile(null)
        setNameError("")
        setDateError("")
        setURLError("")
    }

    const postLabResults = (url) => {
        let doctor = doctors ? doctors.find(d => d.name === query) : null
        let obj = {
            name: form.name,
            date: new Date(form.date),
            url: url,
            patient_id: patient.id,
            doctor_name: doctor.name
        }
        fetch('http://localhost:3000/admin/lab_results', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify(obj)
        })
            .then((res) => res.json())
            .then(data => {
               if (data.error) {
                   setNameError(data.error.name)
                   setDateError(data.error.date)
                   setURLError(data.error.url)
               } else {
                   setLabResults([...labResults, data])
                   setShow(false)
                   setForm({})
                   setFile(null)
               }
            })
    }


    return(
        <Modal show={show} onHide={() => hideShow()} animation={false}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Find a Doctor</Form.Label>
                        <Form.Control type="search" value={query} 
                            placeholder="search by name or title..." 
                            className="mr-2" aria-label="Search" 
                            onChange={doctorChange} 
                            onBlur={() => {setTimeout(() => {setResults([])}, 100)}}
                            autoComplete="off" required/>
                        {results && results.map((r, i) => 
                            <div key={i} className="results col-md-12 justify-content-md-center" onClick={() => onResults(r.name, r.title)} style={{fontSize: "20px"}}>{r.name}, {r.title}</div>)
                        }  
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                            <Form.Label>Test</Form.Label>
                            <Form.Control type="text" name="name" value={form.name} onChange={handleChange}/>
                            {nameError ? <Form.Text type= "invalid" style={{color: "red"}}>{nameError}</Form.Text>: null}
                        </Form.Group>
                        <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                            <Form.Label>Upload Date</Form.Label>
                            <Form.Control type="datetime-local" name="date" value={form.date} onChange={handleChange}/>
                            {dateError ? <Form.Text type= "invalid" style={{color: "red"}}>{dateError}</Form.Text>: null}
                        </Form.Group>
                        <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                            <Form.Control type="file" name="file" onChange={handleFile}/>
                            {URLError ? <Form.Text type= "invalid" style={{color: "red"}}>{URLError}</Form.Text>: null}
                    </Form.Group>
                    <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button> 
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default LabForm;