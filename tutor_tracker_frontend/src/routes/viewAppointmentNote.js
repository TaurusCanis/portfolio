import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function ViewAppointmentNote() {
    const params = useParams();
    const { BASE_URL, authTokens } = useContext(AuthContext);
    const [appointment, setAppointment] = useState();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetch(`${BASE_URL}appointment_notes/${params.appointmentNoteId}/`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => {
            return res.json()
        })
        .then(json => {
            setAppointment(json);
            setIsLoading(false);
            return json;
        })
    }, []);

    return (
        <>
        { !isLoading && 
            <>
                <h2>Session Summary</h2>
                <h3>{appointment.customer_name} - {appointment.date_time}</h3>
                <div>
                    Date Sent: {appointment.appointment_note.date_sent}
                </div>
                <div>
                    {appointment.appointment_note.text}
                </div>
            </>
        }
        </>
    );
}