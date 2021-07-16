import {Card} from 'react-bootstrap';
import {useHistory} from "react-router-dom";
import {BsPersonFill} from 'react-icons/bs';
import {ImPhone} from 'react-icons/im'
import {FaLanguage} from 'react-icons/fa'
import {FaRegAddressBook} from 'react-icons/fa'

const PatientsList = ({patient}) => {
    const history = useHistory();

    return (
        <Card border="light" style={{marginBottom: "30px", width: "30%", minWidth: "250px"}} onClick={() => history.push(`/admin/patient/${patient.id}`)}>
            <Card.Header style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{marginRight: "20px"}}><BsPersonFill size="40px" color= "rgb(201, 201, 247)" /> </div>
                <div style={{display: "flex", flexDirection: "column" }}>
                    <b>{patient.name}</b>
                    {patient.date_of_birth}
                </div>
                </Card.Header>
            <Card.Body>
                <Card.Text><FaLanguage size="20px"/> {patient.language ? patient.language : "not entered"}</Card.Text>
                <Card.Text><FaRegAddressBook/> {patient.address ? patient.address : "not entered"}</Card.Text>
                <Card.Text><ImPhone/> {patient.phone_number}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default PatientsList;