
import './App.css';
import {useState, useEffect } from 'react';
import Navigation from "./Navigation";
import AdminLogin from "./adminAuth/AdminLogin"
import AdminSignup from "./adminAuth/AdminSignup"
import AdminHome from "./adminHomePage/AdminHome"
import Patients from "./adminHomePage/Patients"
import Patient from "./adminHomePage/patientProfile/Patient"
import { BrowserRouter as Router, Route} from "react-router-dom";
import 'devextreme/dist/css/dx.light.css';



const App = () => {

  const [user, setUser] = useState(null)
  const [newApptFormShow, setNewApptFormShow] = useState(false)
  const [appt, setAppt] = useState([])
  

 const getUser = () => {
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
          setUser(data.employee)});
    }
  }

  const fetchAppt = () => {
    fetch("http://localhost:3000/appointments", {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      },
  })
  .then(resp => resp.json())
  .then(data => {
      setAppt(data)   
  })
  }

  useEffect(() => {
    getUser()
    fetchAppt()
  }, [])


    return(
      <div>
        <Router>
          <Navigation user={user} setUser = {setUser}/>
          { user ? null :
            <>
              <Route exact path = "/admin/login" render={() => <AdminLogin setUser = {setUser}/>}/> 
              <Route exact path = "/admin/signup" render={() => <AdminSignup setUser = {setUser}/>}/> 
            </>
          }
          <Route exact path= "/admin/home" render={() => <AdminHome appt={appt} setAppt={setAppt}/>}/> 
          <Route exact path= "/admin/patients" render={() => <Patients/>}/>
          <Route path = "/admin/patient" render={() => <Patient user={user} newApptFormShow={newApptFormShow} setNewApptFormShow={setNewApptFormShow} appt={appt} setAppt={setAppt}/>}/> 
        </Router>
      </div>
    )
}

export default App;
