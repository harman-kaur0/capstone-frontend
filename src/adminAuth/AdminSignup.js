
import {Button, Form, Col, Row} from 'react-bootstrap';
import React, {Component} from "react"
import {withRouter} from 'react-router-dom'
import {BiLogInCircle} from 'react-icons/bi'

class AdminSignup extends Component {
    state = {
        name: "",
        username: "",
        password: "",
        confirmPass: "",
        title: "",
        role: "",
        email: "",
        emailError: "",
        nameError: "",
        usernameError: "",
        passwordError: "",
        confirmPassError: "",
        roleError: ""
    }

    handleAuthFetchSignUp = (info) => {
        if (this.state.confirmPass !== this.state.password) {
            this.setState({passwordError: ["password does not match"]})
            return
        } else {
            fetch("http://localhost:3000/admin/employees", {method: "POST", headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({email: info.email, password: info.password, name: info.name, username: info.username, title: info.title, role: info.role})})
            .then(resp => resp.json()).then(data => {
                if(data.error) {
                    this.setState({emailError: data.error.email, nameError: data.error.name, usernameError: data.error.username, passwordError: data.error.password, roleError: data.error.role}) 
                } else {
                    this.props.setUser(data.employee)
                    localStorage.setItem('jwt', data.jwt)
                    this.props.history.push("/admin/home");
                }
            })    
        }
    }


    handleChange = e => {
        let {name, value} = e.target
        this.setState({[name]: value})
    }

  handleSubmit = (event) => {
    let obj = {email: this.state.email, password: this.state.password, name:this.state.name, username: this.state.username, title: this.state.title, role: this.state.role}
    event.preventDefault()
    this.handleAuthFetchSignUp(obj)
  };
  render(){
        return (
            <div className="login">
                <div className="login-container" style={{padding: "20px"}}>
            <Form className = "admin-login-container" onSubmit={this.handleSubmit}>
                 <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Control type="text" placeholder="enter your name..." name="name" value={this.state.name} onChange={this.handleChange} className= {this.state.nameError ? "error": null} />
                        {this.state.nameError ? <Form.Text type= "invalid" style={{color: "red"}}>{this.state.nameError}</Form.Text>: null}
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Control type="text" placeholder="enter your role..." name="role" value={this.state.role} onChange={this.handleChange} className={this.state.roleError ? "error": null}/>
                        {this.state.roleError ? <Form.Text type= "invalid" style={{color: "red"}}>{this.state.roleError}</Form.Text>: null}
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                        <Form.Control type="text" placeholder="enter your title..." name="title" value={this.state.title} onChange={this.handleChange} className={this.state.titleError ? "error": null} autoComplete="off"/>
                    </Form.Group>
                </Row>
               
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom04">
                    <Form.Control type="text" placeholder="enter your email address..." name="email" value={this.state.email} onChange={this.handleChange} className={this.state.emailError ? "error": null}/>
                    {this.state.emailError ? <Form.Text type= "invalid"><ul>{this.state.emailError.map(e => <li style={{color: "red"}}>{e}</li>)}</ul></Form.Text>: null}
                </Form.Group>

                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="formBasicUsername">
                            <Form.Control type="text" placeholder="enter your username..." name="username" value={this.state.username} onChange={this.handleChange} className={this.state.usernameError ? "error": null}/>
                            {this.state.usernameError ? <Form.Text type= "invalid" style={{color: "red"}}>{this.state.usernameError}</Form.Text>: null}
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="password..." name="password" value={this.state.password} onChange={this.handleChange} className={this.state.passwordError ? "error": null}/>
                        {this.state.passwordError ? <Form.Text type= "invalid"><ul>{this.state.passwordError.map(e => <li style={{color: "red"}}>{e}</li>)}</ul></Form.Text>: null}
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="confirm password..." name="confirmPass" value={this.state.confirmPass} onChange={this.handleChange} className={this.state.passwordError ? "error": null}/>
                    </Form.Group>
                </Row>
                <Button type="submit" style={{width: "30%", alignSelf: "center", marginBottom: "20px", marginTop: "20px", background: "rgb(201, 201, 247)", borderColor: "rgb(201, 201, 247)", borderRadius: "10px"}}>
                    <BiLogInCircle/> SIGN IN
                </Button>
            </Form>
            </div>
            </div>

        )
    }
}

export default withRouter(AdminSignup);