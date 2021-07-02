import {Navbar, Nav, Container} from 'react-bootstrap';
import { BoxArrowRight } from 'react-bootstrap-icons'
import {useHistory} from "react-router-dom"


const Navigation = ({user, setUser}) => {

    const history = useHistory()

    const handleLogout = () => {
        localStorage.clear()
        setUser(null)
        history.push("/admin/login")
    }
    return (
        <Navbar collapseOnSelect fixed="top" expand="sm" variant="dark" className="bg-dark justify-content-between" >
            {user ? <Container>
                    <Navbar.Text>Welcome Back, {user.name}!</Navbar.Text>
                    <Nav.Link href="/admin/home">Home</Nav.Link>
                    <Nav.Link href="/admin/patient">Patient</Nav.Link>
                    <BoxArrowRight color="white" size="30px" onClick={handleLogout} />
                </Container>
                :
                <Container>
                    <Nav.Link href="/admin/login">My Health <Navbar.Text>/ Welcome</Navbar.Text></Nav.Link>
                </Container>
                
             }
        </Navbar>
    )
}

export default Navigation