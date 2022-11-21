import { useEffect, useState } from "react";
import { useFormFields } from "../util/hooks";
import { getData, validateForm } from "../util/helpers";
import { useAppContext } from "../util/context";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateAppointmentNote() {
    let params = useParams();
    let navigate = useNavigate();

    const [appointment, setAppointment] = useState({});
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const { authTokens } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [note, setNote] = useState("");

    function updateStates(res) {
        setAppointment(res);
        const date = new Date(res.date_time);
        setDate(date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        setTime(date.toLocaleTimeString('en-US'));
        return;
    }

    try {
        useEffect(() => getData((res) => {
            updateStates(res);
            setIsLoading(false);
        }, `appointments/${params.appointmentId}`, authTokens), []);
    } catch (e) {
        console.log("ERROR: " + e);
    }

    function handleSubmit(e) {
        e.preventDefault();
        let dateFormatted = new Date(date);
        try {
            fetch('http://127.0.0.1:8000/tracker/appointment_notes/', {
                method: "POST",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    appointment: appointment.id,
                    text: note,
                    status: "I",
                    date: dateFormatted.toISOString().split("T")[0],
                })
            })
            .then((response) => response.json())
            .then(res => {
                console.log(res);
                navigate(`/appointments/${params.appointmentId}/`);
            })
        } catch (e) {
            alert("Error!: " + e);
        }
        return;
    }

    return (
        <>
            <h2>Create Appointment Note</h2>
            {appointment.customer} - {date} {time}
            <form onSubmit={handleSubmit}>
                <input type="textarea" value={note} onChange={(e) => setNote(e.target.value)}></input>
                <input type="submit" value="Save"></input>
            </form>
        </>
    )
}