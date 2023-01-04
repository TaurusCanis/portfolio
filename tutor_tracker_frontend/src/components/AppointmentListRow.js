import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AppointmentListRowDate from "./AppointmentListRowDate";

export default function AppointmentListRow({ appointment, key, tableDisplay }) {
    const navigate = useNavigate();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [selected, setSelected] = useState();

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + " " + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    function handleChange(e) {
        console.log("e.target: ", e.target)
        e.preventDefault();
        const appointmentId = e.target.value.split("-")[0];
        const status = e.target.value.split(":")[1];

        fetch(`${BASE_URL}appointments/${appointmentId}/`, {
            method: "PATCH",
            headers: {
                'Authorization': `Token ${authTokens}`,
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                status: status
            })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            return json;
        })
    }

    function sendEmail() {
        console.log("SEND EMAIL")
        
        fetch(`${BASE_URL}appointment_notes/${appointment.appointment_note.id}/send_appointment_note_email/`, {
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

    function createInvoice(e) {
        e.preventDefault();
        // setIsLoadingAppointments(true);
        // setCustomerHasChanged(true);
        // return;
        fetch(`${BASE_URL}invoices/`, {
            method: "POST",
            headers: {
                'Authorization': `Token ${authTokens}`,
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                appointment: appointment.id,
                amount: appointment.fee
            })
        })
        .then(res => {
            if (res.ok) navigate("/dashboard");
            else alert("ERROR!");
        })
    }

    function sendInvoice(e) {
        e.preventDefault();
        fetch(`${BASE_URL}invoices/${appointment.invoice.id}/send_invoice_email/`, {
            method: "POST",
            headers: {
                'Authorization': `Token ${authTokens}`,
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
        .then(res => res.json())
        .then(json => {
            navigate("/dashboard");
            return json;
        })
    }

    return (
            <div className={tableDisplay ? "table-row" : ""} key={key}>
                {appointment.customer_name} - {formatDateTime(appointment.date_time)} 
                <button onClick={() => navigate(`/appointments/${appointment.id}`)}>
                    View
                </button> 
                <label>Status: </label>
                <select onChange={handleChange}>
                    <option selected={appointment.status == 'S'} value={`${appointment.id}-status:S`}>Scheduled</option>
                    <option selected={appointment.status == 'C'} value={`${appointment.id}-status:C`}>Completed</option>
                    <option selected={appointment.status == 'X-C'} value={`${appointment.id}-status:X-C`}>Cancelled - Charge</option>
                    <option selected={appointment.status == 'X-N'} value={`${appointment.id}-status:X-N`}>Cancelled - No Charge</option>
                </select>
                { appointment.appointment_note == null &&  
                    <button onClick={(e) => navigate(`/appointment_notes/create/${appointment.id}`)}>Add Note</button>
                }
                { appointment.appointment_note != null &&  appointment.appointment_note.status == 'I' &&
                    <>
                        <button onClick={(e) => navigate(`/appointment_notes/${appointment.appointment_note.id}`)}>Review Note</button>
                        <button onClick={sendEmail}>Send Note</button>
                    </>
                }
                { appointment.appointment_note != null &&  appointment.appointment_note.status == 'S' &&
                    <>
                        <button onClick={(e) => navigate(`/appointment_notes/${appointment.appointment_note.id}`)}>View Note</button>
                    </>
                }
                { appointment.invoice == null &&  
                    <button onClick={createInvoice}>Add Invoice</button>
                }
                { appointment.invoice != null &&  !appointment.invoice.sent &&
                    <>
                        <button onClick={(e) => navigate(`/invoices/${appointment.invoice.id}`)}>Review Invoice</button>
                        <button onClick={sendInvoice}>Send Invoice</button>
                    </>
                }
                { appointment.invoice != null &&  appointment.invoice.sent &&
                    <>
                        <button onClick={(e) => navigate(`/invoices/${appointment.invoice.id}`)}>View Invoice</button>
                    </>
                }
            </div>
    );
}