import {Button, Modal, Form, Col} from 'react-bootstrap';

const LabForm = ({show, setShow}) => {
    return(
        <Modal show={show} onHide={() => setShow()} animation={false}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Test Name</Form.Label>
                        <Form.Control type="text" name="name"/>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Label>Upload Date</Form.Label>
                        <Form.Control type="datetime-local" name="date"/>
                    </Form.Group>
                    <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                        <Form.Control type="file" name="file"/>
                    </Form.Group>
                    <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button> 
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default LabForm;