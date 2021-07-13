import React, { Component } from "react";
import {Button, Form, Nav, InputGroup, Col, Card} from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import {RiLockPasswordLine} from 'react-icons/ri'
import {RiUser3Line} from 'react-icons/ri'
import {BiLogInCircle} from 'react-icons/bi'

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
          <div className="login">
            <div className="login-container">
              <div className="login-left">
              <div className="login-img">
                <img src="https://i.pinimg.com/474x/f5/8c/d4/f58cd4242bf402d46f0126917d298d53.jpg"/>
              </div>
              <div className="clinic-name">
                <h2>Clinic Name</h2>
              </div>
            </div>
            <div className="login-form">
              <Form className = "admin-login-container" onSubmit={this.handleSubmit}>
                
                <Form.Group as={Col} md="4" controlId="formBasicUsername">
                      <div className="form-input-container">
                        <RiUser3Line size="20px"/>
                        <input required type="text" placeholder="enter username..." name= "username" value={this.state.username} onChange={this.handleChange} className="login-input" autoComplete="off"/>
                      </div>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="formBasicPassword">
                      <div className="form-input-container">
                      <RiLockPasswordLine size="20px"/>
                      <input required type="password" placeholder="enter your password..." name= "password" value={this.state.password} onChange={this.handleChange} className="login-input"/>
                      </div>
                  </Form.Group>
                  <Button variant="danger" type="submit" style={{width: "30%", alignSelf: "center", marginTop: "30px", marginBottom: "20px"}}>
                     <BiLogInCircle/> SIGN IN
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
            </div>
          </div>

        )
    }
}

export default withRouter(AdminLogin);