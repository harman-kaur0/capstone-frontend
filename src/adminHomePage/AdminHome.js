import {Button} from 'react-bootstrap';
import Scheduler, { Resource} from 'devextreme-react/scheduler';
import { useState } from 'react';
import {formatDate} from 'devextreme/localization';
import AppointmentForm from './AppointmentForm'
import {useHistory} from 'react-router-dom'


const AdminHome = ({appt, setAppt}) => {
    const history = useHistory();
    const [formShow, setFormShow] = useState(false)

    const employeeData = () => {
        let arr = appt.length ? appt.map(d => JSON.stringify({text: d.employee.name, id: d.employee.id})) : []
        arr = arr.filter((value, idx) => arr.indexOf(value) === idx)
        return arr.map(obj => JSON.parse(obj))
    }
    const patientData = appt.length ? appt.map(a => ({id: a.patient.id, text: a.patient.name, dob: a.patient.date_of_birth, phone_number: a.patient.phone_number})) : []
    const data = appt.length ? appt.map(a => ({employeeId: a.employee.id, patientId: a.patient.id, reason: a.reason, startDate: new Date(a.startDate), endDate: new Date(a.endDate)})) : []

    const filterData = data.filter(d => new Date(d.startDate).getTime() >= Date.now())

    const getPatientById = id => {
        return patientData.find(p => p.id === id)
    }


    const Appointment = model => {
        const {appointmentData} = model.data
        const patient = getPatientById(appointmentData.patientId) || {};
        return (
            <div style={{backgroundColor: "rgb(201, 201, 247)"}}>
                <div>{patient.text}</div>
                <div>{patient.dob}</div>
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
            <div onClick={() => history.push(`/admin/patient/${patient.id}`)} style={{backgroundColor: "rgb(201, 201, 247)"}}>
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
        <div style={{marginTop: "60px", display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Button style={{marginBottom: "10px", background: "rgb(97, 97, 212)", fontFamily: "monospace"}} onClick={() => setFormShow(true)}>Schedule an Appointment</Button>
            <Scheduler
                style={{maxWidth: "100%"}}
                timeZone="America/Los_Angeles"
                dataSource={filterData}
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
                <Resource fieldExpr="employeeId" allowMultiple={false} dataSource={employeeData()}/>
            </Scheduler>
            <AppointmentForm appt={appt} setAppt={setAppt} formShow={formShow} setFormShow={setFormShow}/>
            
        </div>
        
    )
}

export default AdminHome;