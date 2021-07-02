import {Button, Modal, Form, Col, Row} from 'react-bootstrap';
import {useState} from 'react'

const Patients = () => {

    const [show, setShow] = useState(false);

    const [form, setForm] = useState({name:"", date_of_birth:"", address:"", phone_number:"", ethicity:"", race:"", email:"", language:""})

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = () => {
        setShow(false)
    }

    return (
        <div>
            <div className="add-patient">
                <Button style={{"margin-top": "100px"}} variant="outline-primary" onClick={() => setShow(true)}>Add a new patient</Button>
            </div>
            <Modal show={show} onHide={() => setShow(false)} animation={false}>
                <Modal.Header closeButton> 
                    <Modal.Title>New Patient Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-2" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>  
                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={form.name} onChange={handleChange}/>
                                {/* {this.state.nameError ? <Form.Text type= "invalid" style={{color: "red"}}>{this.state.nameError}</Form.Text>: null} */}
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustom02">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="datetime" name="date_of_birth" value={form.date_of_birth} onChange={handleChange}/>
                                {/* {this.state.roleError ? <Form.Text type= "invalid" style={{color: "red"}}>{this.state.roleError}</Form.Text>: null} */}
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="4" controlId="validationCustom03">
                                <Form.Label>Ethnicity</Form.Label>
                                <Form.Control type="text" name="ethnicity" value={form.ethicity} onChange={handleChange}/>
                            </Form.Group>
            
                            <Form.Group as={Col} md="4" controlId="validationCustom04">
                                <Form.Label>Race</Form.Label>
                                <Form.Control type="text"  name="race" value={form.race} onChange={handleChange} />
                                {/* {this.state.emailError ? <Form.Text type= "invalid"><ul>{this.state.emailError.map(e => <li style={{color: "red"}}>{e}</li>)}</ul></Form.Text>: null} */}
                            </Form.Group>

                            <Form.Group as={Col} md="4" controlId="validationCustom05">
                                <Form.Label>Language</Form.Label>
                                    <Form.Control type="text" name="language" value={form.language} onChange={handleChange}/>
                                    {/* {this.state.usernameError ? <Form.Text type= "invalid" style={{color: "red"}}>{this.state.usernameError}</Form.Text>: null} */}
                            </Form.Group>
                        </Row>

                            <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom06">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" name="address" value={form.address} onChange={handleChange}/>
                                {/* {this.state.passwordError ? <Form.Text type= "invalid"><ul>{this.state.passwordError.map(e => <li style={{color: "red"}}>{e}</li>)}</ul></Form.Text>: null} */}
                            </Form.Group>
                            <Row className="mb-2" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Form.Group as={Col} md="4" controlId="validationCustom07">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="text" name="phone_number" value={form.phone_number} onChange={handleChange}/>
                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="validationCustom08">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" name="email" value={form.email} onChange={handleChange}/>
                                </Form.Group>
                            </Row>
                        <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal> 
        </div>

    )
}

export default Patients;