import {Navbar, Nav, Container} from 'react-bootstrap';
import { BoxArrowRight } from 'react-bootstrap-icons'
import {useHistory} from "react-router-dom"
import {RiHospitalFill} from "react-icons/ri"
import {TiLocation} from "react-icons/ti"
import {MdLocalPhone} from "react-icons/md"
import {AiOutlineSchedule} from 'react-icons/ai'
import {BsFillPeopleFill} from "react-icons/bs"


const Navigation = ({user, setUser}) => {

    const history = useHistory()

    const handleLogout = () => {
        localStorage.clear()
        setUser(false)
        history.push("/admin/login")
    }
    return (
        <>
            <Navbar className="topNavbar" >
                    <div style={{width: "100%"}}>
                        <TiLocation size= "30px"/> 
                        <Navbar.Text style={{marginRight: "20px"}}> 12345 Santa Barbara St, Amazen, CA</Navbar.Text>
                        <MdLocalPhone size= "25px"/>
                        <Navbar.Text>123-456-7890</Navbar.Text>
                    </div>
            </Navbar>
            <Navbar collapseOnSelect sticky="top" expand="sm" variant="dark" className="bg-dark justify-content-between" >
                {user ? <Container>
                        <RiHospitalFill color="rgb(97, 97, 212)" size= "30px"/>
                        <Navbar.Text>Welcome Back, {user.name}!</Navbar.Text>
                        <Nav.Link href="/admin/home" style={{color: "rgb(97, 97, 212)"}}><AiOutlineSchedule size="20px"/> / Home</Nav.Link>
                        <Nav.Link href="/admin/patients" style={{color: "rgb(97, 97, 212)"}}><BsFillPeopleFill size="18px"/> / Patients</Nav.Link>
                        <BoxArrowRight color="white" size="30px" onClick={handleLogout} />
                        
                    </Container>
                    :
                    <Container>
                        <RiHospitalFill color="red" size="30px"/>
                        <Nav.Link href="/admin/login">My Clinic <Navbar.Text>/ Welcome</Navbar.Text></Nav.Link>
                    </Container>
                    
                }
            </Navbar>
        </>
    )
}

export default Navigation