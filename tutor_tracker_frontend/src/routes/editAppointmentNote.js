import { useEffect, useState } from "react";
import { useFormFields } from "../util/hooks";
import { getData, validateForm } from "../util/helpers";
import { useAppContext } from "../util/context";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditAppointmentNote() {
    let params = useParams();
    let navigate = useNavigate();

    const [appointment, setAppointment] = useState({});
    const [appointmentNote, setAppointmentNote] = useState({});
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [note, setNote] = useState("");
    const [isBeingEdited, setIsBeingEdited] = useState(true);

    function updateStates(res) {
        setAppointment(res);
        const date = new Date(res.date_time);
        setDate(date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        setTime(date.toLocaleTimeString('en-US'));
        setNote(res.appointment_note.text)
        return;
    }

    useEffect(() => {
        fetch(`${BASE_URL}appointment_notes/${params.appointmentNoteId}`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => {
            return res.json()
        })
        .then(json => {
            console.log("JSON: ", json);
            updateStates(json);
            setIsLoading(false);
        })
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        let dateFormatted = new Date(date);
        try {
            console.log("NOTE TEXT: ", note)
            fetch(`${BASE_URL}appointment_notes/${params.appointmentNoteId}/`, {
                method: "PUT",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    appointment: appointment.id,
                    text: note,
                    // status: "I",
                    // date: dateFormatted.toISOString().split("T")[0],
                })
            })
            .then((response) => response.json())
            .then(res => {
                console.log(res);
                // navigate(`/appointments/${appointment.id}/`);
                setIsBeingEdited(false);
            })
        } catch (e) {
            alert("Error!: " + e);
        }
        return;
    }

    function sendEmail() {
        console.log("SEND EMAIL")
        
        fetch(`${BASE_URL}appointment_notes/${params.appointmentNoteId}/send_appointment_note_email/`, {
            method: "POST",
            headers: {
                'Authorization': `Token ${authTokens}`,
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
        .then(res => res.json)
        .then(json => {
            console.log("JSON: ", json);
            navigate(`/appointments/${appointment.id}/`);
        });
    }

    return (
        <>
        { !isLoading && appointmentNote && isBeingEdited &&
        <>
            <h2>Edit Appointment Note</h2>
            {appointment.customer_name} - {date} {time}
            <form onSubmit={handleSubmit}>
                <input type="textarea" value={note} onChange={(e) => setNote(e.target.value)}></input>
                <input type="submit" value="Save and Review"></input>
            </form>
        </>
        }
        { !isLoading && appointmentNote && !isBeingEdited &&
        <>
            <h2>Edit Appointment Note</h2>
            {appointment.customer_name} - {date} {time}
            <div>{note}</div>
            <button onClick={() => setIsBeingEdited(true)}>Edit</button>
            <button onClick={sendEmail}>Send</button>
        </>
        }
        </>
    )
}