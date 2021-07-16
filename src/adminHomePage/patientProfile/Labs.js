import { Card } from 'react-bootstrap';
import {MdSchedule} from "react-icons/md"

const Labs = ({l}) => {
    const convert = str => {
        var date = new Date(str)
        return date.toLocaleString([], {month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})
    }
    return (
        <>
            <Card border="light" style={{width: "80%", marginBottom: "30px", minWidth: "250px"}}>
                <a style={{display: "flex", alignItems: "center", padding: "4px", justifyContent: "center", color: "black"}} href={l.url} target="_blank">
                    <b>{l.name}, <MdSchedule size="25px" /> </b>{convert(l.date)} 
                    {l.doctor_name ? 
                        <><b style={{marginLeft: "auto", paddingRight: "5px"}}>Ordered By:</b> {l.doctor_name} </>: 
                        null
                    }
                </a>
            </Card> 
        </>
    )
}

export default Labs;