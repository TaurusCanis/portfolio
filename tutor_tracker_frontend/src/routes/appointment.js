import { useState, useEffect } from "react";
import { Navigate, useFetcher, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getData } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import CustomerName from "../components/CustomerName";
import CrudButton from "../components/CrudButton";
import PanelRow from "../components/PanelRow";

export default function Appointment() {
    let params = useParams();

    const [appointment, setAppointment] = useState({});
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [note, setNote] = useState("Create");
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [appointmentNote, setAppointmentNote] = useState();
    const navigate = useNavigate();

    function updateStates(res) {
        setAppointment(res);
        const date = new Date(res.date_time);
        setDate(date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        setTime(date.toLocaleTimeString('en-US'));
        // setNote(getNoteStatus(res.appointment_note));
        return;
    }


    useEffect(() => {
        if (authTokens) {
            fetch(`${BASE_URL}appointments/${params.appointmentId}/`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                // setAppointment(json);
                updateStates(json)
                setIsLoading(false);
                console.log("appointment: ", json)
            })
        }
        else {
            navigate("/");
        }
    }, [])

    function getNoteStatus(appointment_note) {
        console.log("appointment_note: ", appointment_note);
        if (appointment_note == undefined) return "create"
        else if (appointment_note.status == "I") return "edit"
        else return "View"
    }

    function getAppointmentStatus(appointment_status) {
        switch (appointment_status) {
            case "C": 
                return "Complete"; 
            case "X-C":
                return "Cancelled - Charge";
            case "X-N":
                return "Cancelled - No Charge";
            default:
                return "Scheduled";
        }
    }

    return (
        <div className="container-v">
            { isLoading &&
                <div class="loader"></div>
            }
            { !isLoading &&
            <>
            <h2>Appointment Detail</h2>
            <div className="model-display">
                <h3>
                    <CustomerName name={appointment.customer_name} id={appointment.customer_id}/>
                </h3>
                <PanelRow label="Date" value={`${date} ${time}`}/>
                <PanelRow label="Fee" value={appointment.fee}/>
                <PanelRow label="Length" value={appointment.length}/>
                <PanelRow label="Status" value={getAppointmentStatus(appointment.status)}/>

                {/* { appointment.status != "S" &&
                    <>
                        <Link 
                            style={{display:'block'}}
                            // key={i}
                            to={`/appointments/${params.appointmentId}/${note}AppointmentNote`}>
                            {note[0].toUpperCase() + note.slice(1)} Note
                        </Link> 
                        <Link 
                            style={{display:'block'}}
                            // key={i}
                            to={`/invoices/${params.appointmentId}/create`}>
                            Create Invoice
                        </Link> 
                    </>
                }
                { appointmentNote && 
                    <Link 
                        style={{display:'block'}}
                        // key={i}
                        to={`/appointments/${params.appointmentId}/viewAppointmentNote`}>
                        View Note
                    </Link> 
                } */}
                <div className="container-h list-row">
                    <CrudButton path={`/appointments/${appointment.id}/edit`} label="Edit Appointment" />
                    { 
                        appointment.status != 'S' && appointment.appointment_note == null && 
                        <CrudButton path={`/appointment_notes/create`} label="Add Appointment Note" />
                    }
                    { 
                        appointment.status != 'S' && appointment.appointment_note != null && appointment.appointment_note.status != 'C' &&
                        <CrudButton path={`/appointment_notes/${appointment.appointment_note.id}/edit`} label="Edit Appointment Note" />
                    }
                    { 
                        appointment.status != 'S' && appointment.appointment_note != null && appointment.appointment_note.status == 'C' &&
                        <CrudButton path={`/appointment_notes/${appointment.appointment_note.id}/`} label="View Appointment Note" />
                    }
                    <CrudButton path={`/appointments/${appointment.id}/delete`} label="Delete Appointment" />
                </div>
            </div>

            
            </>
            }
        </div>
    );
  }