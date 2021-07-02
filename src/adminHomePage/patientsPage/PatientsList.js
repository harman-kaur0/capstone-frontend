import {Card} from 'react-bootstrap';
import {useHistory} from "react-router-dom";
const PatientsList = ({patient}) => {
    const history = useHistory();

    return (
        <Card border="light" style={{width: "60rem", marginBottom: "30px"}} onClick={() => history.push(`/admin/patient/${patient.id}`)}>
            <Card.Header>Patient's name: {patient.name}</Card.Header>
            <Card.Body>
                <Card.Text>Date of Birth:  {patient.date_of_birth}</Card.Text>
                <Card.Text>Language:  {patient.language}</Card.Text>
                <Card.Text>Address:  {patient.address}</Card.Text>
                <Card.Text>Phone Number:  {patient.phone_number}</Card.Text>

            </Card.Body>
        </Card>
    )
}

export default PatientsList;