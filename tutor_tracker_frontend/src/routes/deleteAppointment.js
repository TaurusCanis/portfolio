import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getData } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import PanelRow from "../components/PanelRow";

export default function DeleteAppointment() {
    let params = useParams();

    const [appointment, setAppointment] = useState({});
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [note, setNote] = useState();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    let navigate = useNavigate();

    async function handleDelete() {
        const res = await fetch(`${BASE_URL}appointments/${appointment.id}`, {
            method: "DELETE",
            headers: {
              'Authorization': `Token ${authTokens}`,
            }
          });
          if (res.ok) navigate("/appointments");
          else alert("There was a problem!");
    }

    function updateStates(res) {
        setAppointment(res);
        const date = new Date(res.date_time);
        setDate(date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        setTime(date.toLocaleTimeString('en-US'));
        setNote(getNoteStatus(res.appointment_note));
        return;
    }

    useEffect(() => {
        if (authTokens) {
            fetch(BASE_URL + "appointments/" + params.appointmentId, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                setAppointment(json);
                updateStates(json);
                setIsLoading(false);
            })
        }
        else {
            navigate("/");
        }
    }, [])
    

    function getNoteStatus(appointment_note) {
        console.log("appointment_note: ", appointment_note);
        if (appointment_note == undefined) return "Create"
        else if (appointment_note.status == "I") return "Edit"
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
        <>
            { isLoading &&
            <div className="container-v">
                <div class="loader"></div>
            </div>
            }
            { !isLoading &&
            <>
            <h2>Are you sure you want to delete?</h2>
            <div className="model-display">
                <h3>Appointment</h3>
                <PanelRow label="Customer" value={appointment.customer_name}/>
                <PanelRow label="Date" value={`${date} ${time}`}/>
                <PanelRow label="Fee" value={appointment.fee}/>
                <PanelRow label="Length" value={appointment.length}/>
                <PanelRow label="Status" value={getAppointmentStatus(appointment.status)}/>
                <div className="container-h list-row">
                    <Link 
                        to={`/appointments/${appointment.id}`}>
                        <button>Cancel</button>
                    </Link> 
                    <button onClick={handleDelete}>
                        Delete Appointment
                    </button>
                </div>
            </div>
            </>
            }
        </>
    );
  }