import { Link } from "react-router-dom";
import AppointmentListRowDate from "./AppointmentListRowDate";

export default function AppointmentListRow({ appointment, key, tableDisplay }) {

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + " " + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    return (
            // <div className="list-row">
                <Link 
                    className={tableDisplay ? "table-row" : ""}
                    key={key}
                    to={`/appointments/${appointment.id}`}>
                    {appointment.customer_name} - {formatDateTime(appointment.date_time)} 
                </Link>  
            // </div>
    );
}