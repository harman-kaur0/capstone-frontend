import { Modal, Button, Form, Col } from 'react-bootstrap';
import Scheduler, { Resource} from 'devextreme-react/scheduler';
import { useState, useEffect } from 'react';
import {formatDate} from 'devextreme/localization';
import AppointmentForm from './AppointmentForm'


const AdminHome = ({appt, setAppt}) => {
    const [formShow, setFormShow] = useState(false)


    const employeeData = appt.length ? appt.map(d => ({text: d.employee.name, id: d.employee.id})) : []
    const patientData = appt.length ? appt.map(a => ({id: a.patient.id, text: a.patient.name, dob: a.patient.date_of_birth, phone_number: a.patient.phone_number})) : []
    const data = appt.length ? appt.map(a => ({employeeId: a.employee.id, patientId: a.patient.id, reason: a.reason, startDate: new Date(a.startDate), endDate: new Date(a.endDate)})) : []

    const getPatientById = id => {
        return patientData.find(p => p.id === id)
    }


    const convert = str => {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2),
            hrs = ("0" + date.getHours()).slice(-2),
            mins = ("0" + date.getMinutes()).slice(-2)
        return `${[date.getFullYear(), mnth, day].join("-")}T${hrs}:${mins}`
    }

    const Appointment = model => {
        const {appointmentData} = model.data
        // console.log(model.data)
        const patient = getPatientById(appointmentData.patientId) || {};
        return (
            <div>
                <div> <b>Patient:</b> {patient.text} </div>
                <div><b>Date of Birth: </b>{patient.dob} </div>
                <div>
                    {formatDate(appointmentData.startDate, 'shortTime')}
                    {' - '}
                    {formatDate(appointmentData.endDate, 'shortTime')}
                </div>
            </div>
        )
    }

    const AppointmentTooltip = (model) => {
        const {appointmentData} = model.data
        const patient = getPatientById(appointmentData.patientId) || {};
        return (
            <div>
                <div> <b>Patient:</b> {patient.text} </div>
                <div><b>Date of Birth: </b>{patient.dob} </div>
                <div><b>Phone Number: </b>{patient.phone_number} </div>
                <div>
                    {formatDate(appointmentData.startDate, 'shortTime')}
                    {' - '}
                    {formatDate(appointmentData.endDate, 'shortTime')}
                </div>
                <div>
                    Reason: {appointmentData.reason}
                </div>
            </div>
        )

    }
  
    
    return (
        <div style={{marginTop: "60px"}}>
            <Button style={{marginBottom: "10px"}} onClick={() => setFormShow(true)}>Make a new appointment</Button>
            <Scheduler
                timeZone="America/Los_Angeles"
                dataSource={data}
                views={['day', 'week', 'month']}
                defaultCurrentView="day"
                defaultCurrentDate={Date.now()}
                groups={['employeeId']}
                height={600}
                firstDayOfWeek={0}
                startDayHour={8}
                endDayHour={17}
                showAllDayPanel={false}
                crossScrollingEnabled={true}
                cellDuration={30}
                editing={{allowAdding: false, allowUpdating: false }}
                appointmentComponent={Appointment}
                onAppointmentFormOpening={e => e.cancel = true}
                appointmentTooltipComponent={AppointmentTooltip}
            >
                <Resource dataSource={employeeData} fieldExpr="employeeId"/>
                <Resource dataSource={patientData} fieldExpr="patientId"/>
            </Scheduler>
            <AppointmentForm appt={appt} setAppt={setAppt} formShow={formShow} setFormShow={setFormShow}/>
            
        </div>
        
    )
}

export default AdminHome;