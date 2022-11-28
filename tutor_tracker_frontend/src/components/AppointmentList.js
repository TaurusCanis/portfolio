import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AppointmentListRow from "./AppointmentListRow";


export default function AppointmentList({ appointments, completed, setDataHasUpdated }) {
    const { BASE_URL, authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleClick(e) {
        e.preventDefault();
        fetch(`${BASE_URL}appointments/${e.target.id}/`, {
            method: "PATCH",
            headers: {
                'Authorization': `Token ${authTokens}`,
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                status: 'C',
            })
        })
        .then(res => res.json())
        .then(json => {
            setDataHasUpdated(true);
            console.log(json);
        })
    }

    function dateTimeHasPassed(dateTime) {
        const now = new Date();
        const nowISO = now.toISOString().slice(0, -5)
        return nowISO > dateTime;
    }

    function navigateTo(path) {
        navigate("/appointment_notes/" + path + "/");
    }

    return (
        <>
        { appointments.map((appointment, i) => (
            <div>
            <AppointmentListRow appointment={appointment} />
            { appointment.status == 'S' && dateTimeHasPassed(appointment.date_time) && 
                <button title="Mark as Complete" id={appointment.id} onClick={handleClick}>C</button>
            }
            { appointment.status != 'S' && appointment.appointment_note == null && 
                <button title="Add Appointment Note" id={appointment.id} onClick={() => navigateTo("create")}>N</button>
            }
            {
                appointment.appointment_note != null && appointment.appointment_note.status == 'I' &&
                <button title="Edit Appointment Note" id={appointment.id} onClick={() => navigateTo(`${appointment.appointment_note.id}/edit`)}>E</button>
            }
            {
                appointment.appointment_note != null && appointment.appointment_note.status == 'C' &&
                <button title="View Appointment Note" id={appointment.id} onClick={() => navigateTo(`${appointment.appointment_note.id}/`)}>V</button>
            }
            </div>
        ))}
        </>
    );
}