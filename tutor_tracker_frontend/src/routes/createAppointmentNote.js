import { useEffect, useState } from "react";
import { useFormFields } from "../util/hooks";
import { getData, validateForm } from "../util/helpers";
import { useAppContext } from "../util/context";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectInput from "../components/SelectInput";

export default function CreateAppointmentNote() {
    let params = useParams();
    let navigate = useNavigate();

    const [appointment, setAppointment] = useState({});
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [note, setNote] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [appointmentId, setAppointmentId] = useState();
    // const [fields, handleFieldChange] = useFormFields({
    //     "appointment_id": ""
    // });

    function updateStates(res) {
        setAppointment(res);
        const date = new Date(res.date_time);
        setDate(date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        setTime(date.toLocaleTimeString('en-US'));
        return;
    }

    // try {
    //     useEffect(() => getData((res) => {
    //         updateStates(res);
    //         setIsLoading(false);
    //     }, `appointments/${params.appointmentId}`, authTokens), []);
    // } catch (e) {
    //     console.log("ERROR: " + e);
    // }

    useEffect(() => {
        if (!params.appointmentId) {
            fetch(`${BASE_URL}appointments?appointment_notes=null`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                console.log("JSON: ", json)
                setAppointments(json);
                setIsLoading(false);
            });
        } 
        else {
            fetch(`${BASE_URL}appointments/${params.appointmentId}/`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                console.log("JSON: ", json)
                setAppointment(json);
                setIsLoading(false);
            });
        }
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        let dateFormatted = new Date(date);
        try {
            fetch(`${BASE_URL}appointment_notes/`, {
                method: "POST",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    // appointment: appointment.id,
                    appointment: appointmentId || appointment.id,
                    text: note,
                    status: "I",
                    // date: dateFormatted.toISOString().split("T")[0],
                })
            })
            .then((response) => {
                if (response.ok) navigate("/dashboard")
            })
        } catch (e) {
            alert("Error!: " + e);
        }
        return;
    }

    // function updateAppointmentId(e) {
    //     console.log("E: ", e);
    //     setAppointmentId(e.target.id)
    // }

    return (
        <>
            <h2>Create Appointment Note</h2>
            {
                !isLoading && !params.appointmentId && appointments.length == 0 ?
                <>
                    <h3>No Appointments!</h3>
                    <button onClick={() => navigate("/createAppointment")}>Create an Appointent</button>
                </>

                :
                <>
                { !isLoading && params.appointmentId &&
                    <span>Create Appointment Note for {appointment.customer_name} - {appointment.date_time}</span>
                }
                <form onSubmit={handleSubmit}>
                {
                    !isLoading && appointments.length > 0 &&
                    <>
                    {/* {appointment.customer} - {date} {time} */}
                    
                        <select id="appointment_select" value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)}>
                            {/* default/empty option? */}
                            <option>--Select--</option>
                            {appointments.map(appointment => 
                                <option value={appointment.id} key={appointment.id}>{appointment.customer_name} - {appointment.date_time}</option>    
                            )}
                        </select>
                        
                    
                    </>
                } 
                    <textarea value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                    <input type="submit" value="Save"></input>
                </form>
                </>
            }
              
            
        </>
    )
}