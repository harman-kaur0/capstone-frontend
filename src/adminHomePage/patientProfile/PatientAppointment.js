import { useState, useEffect } from 'react';
import { Modal} from 'react-bootstrap';
import Paper from '@material-ui/core/Paper';
import { ViewState,  EditingState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Appointments,
    AppointmentForm,
    EditRecurrenceMenu,
    AllDayPanel,
    ConfirmationDialog,
    DayView,
    AppointmentTooltip,
    MonthView, 
    Toolbar,
    DateNavigator,
    Resources
  } from '@devexpress/dx-react-scheduler-material-ui';
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
  import { fade } from '@material-ui/core/styles/colorManipulator';
  import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const useStyles = makeStyles(theme => ({
  todayCell: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
  },
  weekendCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
  },
  today: {
    backgroundColor: fade(theme.palette.primary.main, 0.16),
  },
  weekend: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
  },
}));

const TimeTableCell = (props) => {
  const classes = useStyles();
  const { startDate } = props;
  const date = new Date(startDate);

  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
  } if (date.getDay() === 0 || date.getDay() === 6) {
    return <WeekView.TimeTableCell {...props} className={classes.weekendCell} />;
  } return <WeekView.TimeTableCell {...props} />;
};

const DayScaleCell = (props) => {
  const classes = useStyles();
  const { startDate, today } = props;

  if (today) {
    return <WeekView.DayScaleCell {...props} className={classes.today} />;
  } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <WeekView.DayScaleCell {...props} className={classes.weekend} />;
  } return <WeekView.DayScaleCell {...props} />;
};

const ExternalViewSwitcher = ({currentViewName,onChange}) => (
  <RadioGroup
    aria-label="Views"
    style={{ flexDirection: 'row' }}
    name="views"
    value={currentViewName}
    onChange={onChange}
  >
    <FormControlLabel value="Day" control={<Radio />} label="Day" />
    <FormControlLabel value="Week" control={<Radio />} label="Week" />
    <FormControlLabel value="Work Week" control={<Radio />} label="Work Week" />
    <FormControlLabel value="Month" control={<Radio />} label="Month" />
  </RadioGroup>
);

const Appointment = ({children, style, ...restProps }) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: '#FFC107',
      borderRadius: '8px',
    }}
  >
    {children}
  </Appointments.Appointment>
);

const TextEditor = ({onFieldChange, appointmentData}) => {
  const onDateChange = nextValue => {
    onFieldChange({ start: nextValue });
  };
  const onReasonChange = nextValue => {
    onFieldChange({ reason: nextValue });
  };

  return (
    <div>
      <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
    >
     <AppointmentForm.Label text="Reason" type="title" />
     <AppointmentForm.TextEditor placeholder="reason for appt"  type="text" />
    <AppointmentForm.DateEditor value="Date" onValueChange={onDateChange}/>
    </AppointmentForm.BasicLayout>
  </div>)
}

const PatientAppointment = ({patient, aptShow, setAptShow, fullscreen}) => {
    const [doctors, setDoctors] = useState([])
    const [appt, setAppt] = useState([])
    const [currentViewName, setCurrentViewName] = useState("Month")
    const [currentDate, setCurrentDate] = useState(Date.now())
    const [addedAppt, setAddedAppt] = useState({})
    const [apptChanges, setApptChanges] = useState({})
    const [editAppt, setEditAppt] = useState(undefined)

   const changeAddedAppt = (addedAppt) => {
     setAddedAppt(addedAppt)
   }

   const changeApptChanges = (apptChanges) => {
     setApptChanges(apptChanges)
   }

   const changeEditAppt = (editAppt) => {
     setEditAppt(editAppt)
   }

   const commitChanges = ({added, changed, deleted })=> {
     if (added) {
       const addedId = appt.length > 0 ? appt[appt.length - 1].id + 1 : 0;
       setAppt([...appt, {id: addedId, ...added}])
     }

     if (changed) {
       const updatedAppt = appt.map(a => changed[a.id] ? {...a, ...changed[a.id]} : a)
       setAppt(updatedAppt)
     }

     if (deleted !== undefined) {
       setAppt(appt.filter(a => a.id !== deleted))
     }
   }

    const currentViewNameChange = (e) => {
        setCurrentViewName( e.target.value );
      };

    const fetchDoctors = () => {
        fetch("http://localhost:3000/admin/doctors", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
        .then(resp => resp.json())
        .then(data => {
            setDoctors(data)
        })
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

    useEffect (() => {
        fetchDoctors()
        fetchAppt()
    }, [])

    return (
        <> 
            <Modal className="custom" show={aptShow} fullscreen={fullscreen} onHide={() => setAptShow(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <React.Fragment>
                        <ExternalViewSwitcher
                            currentViewName={currentViewName}
                            onChange={currentViewNameChange}
                        />
                        <Paper>
                            <Scheduler data={appt} height={660}>
                                <ViewState 
                                defaultCurrentDate={Date.now()} 
                                currentViewName={currentViewName}
                                />
                                
                                <EditingState
                                onCommitChanges = {commitChanges}
                                addedAppointment = {addedAppt}
                                onAddedAppointmentChange = {changeAddedAppt}
                                appointmentChanges = {apptChanges}
                                onAppointmentChangesChange = {changeApptChanges}
                                editingAppointment = {editAppt}
                                onEditingAppointmentChange = {changeEditAppt}
                                />
                                <DayView startDayHour={8} endDayHour={20} />
                                <WeekView startDayHour={8} endDayHour={20} 
                                timeTableCellComponent = {TimeTableCell}
                                dayScaleCellComponent = {DayScaleCell}
                                />
                                <WeekView
                                    name="Work Week"
                                    excludedDays={[0, 6]}
                                    startDayHour={8}
                                    endDayHour={17}
                                />
                                <MonthView/>
                                <AllDayPanel/>
                                <EditRecurrenceMenu/>
                                <ConfirmationDialog/>
                                <Toolbar/>
                                <DateNavigator/>
                                {/* shows the scheduled appointments from backend */}
                                <Appointments appointmentComponent={Appointment} />
                                <AppointmentTooltip
                                  showOpenButton
                                  showDeleteButton
                                />

                                <AppointmentForm  />
                            </Scheduler>
                        </Paper>
                    </React.Fragment>
                </Modal.Body>
            </Modal>
           
        </>
    )
}

export default PatientAppointment;

// const [query, setQuery] = useState("")
// const [results, setResults] = useState([]);
// const [form, setForm] = useState({date_and_time: "", reason: ""})

  // const onResults = (e) => {
    //     setQuery(e);
    //     setResults([]);
    // }


// const handleChange = (e) => {
    //     let matches = []
    //     if(e.target.value.length > 0) {
    //         matches = doctors.filter(d => d.name.toLowerCase().includes(e.target.value) || d.title.toLowerCase().includes(e.target.value))
    //     }
    //     setResults(matches)
    //     setQuery(e.target.value)
    // }

    // const formChange = (e) => {
    //     setForm({...form, [e.target.name]: e.target.value})
    // }



 {/* <Form>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Find a Doctor</Form.Label>
                    <Form.Control type="search" value={query} 
                    placeholder="Search by name or title" 
                    className="mr-2" aria-label="Search" 
                    onChange={handleChange} 
                    onBlur={() => {setTimeout(() => {setResults([])}, 100)}}/>
                    {results && results.map((r, i) => 
                        <div key={i} className="results col-md-12 justify-content-md-center" onClick={() => onResults(r.name, r.title)}>{r.name}, {r.title}</div>)}
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Choose Appointment Date and Time</Form.Label>
                    <Form.Control type="datetime-local" name="date_and_time" value={form.date_and_time} onChange={formChange} />
                </Form.Group>
                <Form.Group as={Col} className="position-relative mb-3" controlId="validationCustom01" >
                    <Form.Label>Reason for appointment</Form.Label>
                    <Form.Control as="textarea" style={{height: '100px'}} name="reason" value={form.reason} onChange={formChange} />
                </Form.Group> 
                <Button style={{marginLeft: "42.5%"}} variant="outline-success" type="Submit">Submit</Button>         
                    </Form> */}