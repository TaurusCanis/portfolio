import { Link } from "react-router-dom";

export default function AppointmentListRowDate({ appointment, key, tableDisplay }) {
    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + " " + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <Link 
            className={tableDisplay ? "table-row" : ""}
            key={key}
            to={`/appointments/${appointment.id}`}>
            {formatDateTime(appointment.date_time)} 
        </Link>  
    );
}