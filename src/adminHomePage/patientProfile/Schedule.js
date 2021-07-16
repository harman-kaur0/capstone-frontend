import { Modal, Button, Form, Col } from 'react-bootstrap';
import Scheduler, { Resource} from 'devextreme-react/scheduler';
import { useState, useEffect } from 'react';
import {formatDate} from 'devextreme/localization';


const Schedule = ({appt, show, setShow}) => {

    const employeeData = () => {
        let arr = appt.length ? appt.map(d => JSON.stringify({text: d.employee.name, id: d.employee.id})) : []
        arr = arr.filter((value, idx) => arr.indexOf(value) === idx)
        return arr.map(obj => JSON.parse(obj))
    }
    const patientData = appt.length ? appt.map(a => ({id: a.patient.id, text: a.patient.name, dob: a.patient.date_of_birth, phone_number: a.patient.phone_number})) : []
    const data = appt.length ? appt.map(a => ({employeeId: a.employee.id, patientId: a.patient.id, reason: a.reason, startDate: new Date(a.startDate), endDate: new Date(a.endDate)})) : []

    const filterData = data.filter(d => new Date(d.endDate).getTime() >= Date.now())

    const getPatientById = id => {
        return patientData.find(p => p.id === id)
    }


    // const convert = str => {
    //     var date = new Date(str),
    //         mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    //         day = ("0" + date.getDate()).slice(-2),
    //         hrs = ("0" + date.getHours()).slice(-2),
    //         mins = ("0" + date.getMinutes()).slice(-2)
    //     return `${[date.getFullYear(), mnth, day].join("-")}T${hrs}:${mins}`
    // }

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
            <div style={{backgroundColor: "rgb(201, 201, 247)"}}>
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
        <Modal show={show} onHide={() => setShow(false)} animation={false} className="modal-width"> 
            <Modal.Header closeButton></Modal.Header>  
            <Scheduler
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
                appointmentTooltipComponent={AppointmentTooltip}
            >
                <Resource dataSource={employeeData()} fieldExpr="employeeId" allowMultiple={false}/>
            </Scheduler>  
        </Modal>   
    )
}

export default Schedule;