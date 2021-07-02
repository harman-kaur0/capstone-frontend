import React, { Component } from "react";
import {Button, Form, Nav, InputGroup, Col, Card} from 'react-bootstrap';
import {withRouter} from 'react-router-dom'

class AdminLogin extends Component {
    state = {
        username: "",
        password: "",
        error: ""
    }

    handleAuthFetchLogin = (info) => {
        fetch('http://localhost:3000/admin/login', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: info.username,
            password: info.password
          })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.employee)
          if(data.error){
              this.setState({error: data.error})
          }else {
            this.props.setUser(data.employee)
            localStorage.setItem('jwt', data.jwt)
            this.props.history.push("/admin/home");
          }
        })
    }

    handleSubmit = e => {
        let obj = {username: this.state.username, password: this.state.password}
        e.preventDefault();
        this.handleAuthFetchLogin(obj)  
    }


    handleChange = e => {
        let {name, value} = e.target
        this.setState({[name]: value})
    }

    render (){
        return (
          <div>
            <Form className = "admin-login-container" onSubmit={this.handleSubmit}>
               
               <Form.Group as={Col} md="4" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>@</InputGroup.Text>
                        <Form.Control required type="text" placeholder="Enter username" name= "username" value={this.state.username} onChange={this.handleChange}/>
                       
                    </InputGroup>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" name= "password" value={this.state.password} onChange={this.handleChange}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    SIGN IN
                </Button>

                {this.state.error ? 
                <Card className="mb-2" style={{ width: '18rem' }}>
                <Card.Header style={{"background": "red", "color": "white"}}>Error</Card.Header>
                <Card.Body>
                  <Card.Text>
                    {this.state.error}
                  </Card.Text>
                </Card.Body>
              </Card>: null}

                <Form.Text>Not Enrolled Yet?</Form.Text>
                <Nav.Link href= "/admin/signup" >SIGN UP</Nav.Link>
            </Form>
          </div>

        )
    }
}

export default withRouter(AdminLogin);