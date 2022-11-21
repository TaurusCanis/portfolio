import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AppointmentListRow from "./AppointmentListRow";


export default function AppointmentList({ appointments, completed, setDataHasUpdated }) {
    const { BASE_URL, authTokens } = useContext(AuthContext);

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

    return (
        <>
        { appointments.map((appointment, i) => (
            <div>
            <AppointmentListRow appointment={appointment} />
            { appointment.status == 'S' && dateTimeHasPassed(appointment.date_time) && 
                <button title="Mark as Complete" id={appointment.id} onClick={handleClick}>C</button>
            }
            </div>
        ))}
        </>
    );
}