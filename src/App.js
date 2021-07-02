
import './App.css';
import { Component } from 'react';
import Navigation from "./Navigation";
import AdminLogin from "./adminAuth/AdminLogin"
import AdminSignup from "./adminAuth/AdminSignup"
import AdminHome from "./adminHomePage/AdminHome"
import Patients from "./adminHomePage/Patients"
import Patient from "./adminHomePage/patientProfile/Patient"
import { BrowserRouter as Router, Route} from "react-router-dom";


class App extends Component {
  state = {
    user: null
  }
  setUser = user => {
    this.setState({user: user})
  }

  componentDidMount(){
    if (localStorage.getItem('jwt')){
      fetch('http://localhost:3000/admin/getemployee', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ user: data.employee})});
    }
  }
  render (){
    return(
      <div>
        <Router>
          <Navigation user={this.state.user} handleLogout={this.handleLogout} setUser = {this.setUser}/>
          { this.state.user ? null :
            <>
              <Route exact path = "/admin/login" render={() => <AdminLogin setUser = {this.setUser}/>}/> 
              <Route exact path = "/admin/signup" render={() => <AdminSignup setUser = {this.setUser}/>}/> 
            </>
          }
          <Route exact path= "/admin/home" render={() => <AdminHome/>}/> 
          <Route exact path= "/admin/patients" render={() => <Patients/>}/>
          <Route path = "/admin/patient" render={() => <Patient/>}/>   
        </Router>
      </div>
    )
  }
}

export default App;
