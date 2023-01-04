import { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getAppointmentStatus, getData } from "../util/helpers"
import { useContext } from "react";
import { useAppContext } from "../util/context";
import AuthContext from "../context/AuthContext";
import DatePicker from "../components/DatePicker";
import AppointmentListRow from "../components/AppointmentListRow";
import CreateButton from "../components/CreateButton";
import { useFormFields } from "../util/hooks";

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [isBeingEditedLengthId, setIsBeingEditedLengthId] = useState();
    const [isBeingEditedFeeId, setIsBeingEditedFeeId] = useState();
    const [appointmentFeesAndLengths, setAppointmentFeesAndLengths] = useState([]);
    const [customers, setCustomers] = useState();
    const [filterFields, handleFilterFieldChange] = useFormFields({
        "customer": null,
        "start_date": null,
        "end_date": null,
        "status": null,
        "appointment_note": null,
    });
    const location = useLocation();

    useEffect(() => {
        console.log("PARAMS: ", location.search)
        let queryString = location.search ? location.search : "";
        if (authTokens) {
            fetch(BASE_URL + "appointments/" + queryString, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                setAppointments(json);
                
                extractLengthsAndFees(json);
                console.log(json);
            });
        }
        else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        fetch(`${BASE_URL}customers/`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => res.json())
        .then(json => {
            setCustomers(json);
            setIsLoading(false);
            return json;
        })
    }, [])

    function extractLengthsAndFees(appointments) {
        setAppointmentFeesAndLengths(appointments.filter(appointment => ({ "fee": appointment.fee, "length": appointment.length }) ));
    }

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + " " + date.toLocaleTimeString('en-US');
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

    function sendEmail(e, appointment) {
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

    function createInvoice(e, appointment) {
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

    function sendInvoice(e, appointment) {
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

    function saveAppointmentData(e, appointment, field) {
        e.preventDefault();
        fetch(`${BASE_URL}appointments/${appointment.id}/`, {
            method: "PATCH",
            headers: {
                'Authorization': `Token ${authTokens}`,
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                [field]: appointment[field]
            })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            if (field == "fee") setIsBeingEditedFeeId(-1);
            else if (field = "length") setIsBeingEditedLengthId(-1);
            return json;
        })
    }

    function handleLengthChange(e, appointment, i, field) {
        e.preventDefault();
        appointments[i][field] = e.target.value;
        setAppointments([...appointments]);
    }

    function handleFilter(e) {
        e.preventDefault();
        console.log("Filter Fields: ", filterFields);
        fetch(`${BASE_URL}appointments/filter_appointments/`, {
            method: "POST",
            headers: {
                'Authorization': `Token ${authTokens}`,
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                "customer": filterFields.customer,
                "start_date": filterFields.start_date,
                "end_date": filterFields.end_date,
                "status": filterFields.status,
                "appointment_notes__status": filterFields.appointment_note
            })
        })
        .then(res => res.json())
        .then(json => {
            setAppointments(json);
            return json;
        })
    }

    // function resetfilter(e) {
    //     e.preventDefault();
    //     Object.keys(filterFields).forEach(k => (
    //         handleFilterFieldChange({[k]: ""})
    //     ));
    //     handleFilter(e);
    // }

    // function addPayment(e) {
    //     e.preventDefault();
    //     fetch(`${BASE_URL}payments/`, {
    //         method: "POST",
    //         headers: {
    //             'Authorization': `Token ${authTokens}`
    //         },
    //         body: JSON.stringify({
    //             customer: ...,
    //             amount: ...,
    //             source: ...,
    //         })
    //     })
    //     .then(res => res.json())
    //     .then(json => {
    //         return json;
    //     })
    // }

    return (
        <>
            { isLoading &&
                <div class="loader"></div>
            }
            <div>
                { !isLoading &&  
                <div>
                    <h3>Appointments</h3>
                    <Link to="/createAppointment">
                        {/* <CreateButton label="Create New Appointment" url="/createAppointment" /> */}
                        <button>
                            Create New Appointment
                        </button>
                    </Link>
                    <div>
                        <form onSubmit={handleFilter}>
                        <   label>Student: </label>
                            <select value={filterFields.customer} onChange={(e) => handleFilterFieldChange({ "customer": e.target.value || null })}>
                                <option value=''>--Select--</option>
                                { customers.map(customer => (
                                    <option value={customer.id}>{customer.last_name}, {customer.first_name}</option>
                                ))}
                            </select>
                            <label>Start Date: </label>
                            <input value={filterFields.start_date} onChange={(e) => handleFilterFieldChange({ "start_date": e.target.value })} type="date" />
                            <label>End Date: </label>
                            <input value={filterFields.end_date} onChange={(e) => handleFilterFieldChange({ "end_date": e.target.value })} type="date" />
                            <label>Status: </label>
                            <select value={filterFields.status} onChange={(e) => handleFilterFieldChange({ "status": e.target.value || null })}>
                                <option value=''>--Select--</option>
                                <option value="S">Scheduled</option>
                                <option value="C">Completed</option>
                                <option value="X-C">Cancelled - Charge</option>
                                <option value="X-N">Cancelled - No Charge</option>
                            </select>
                            <label>Appointment Note: </label>
                            <select value={filterFields.appointment_note} onChange={(e) => handleFilterFieldChange({ "appointment_note": e.target.value || null })}>
                                <option value=''>--Select--</option>
                                <option value="X">Not Started</option>
                                <option value="I">In Progress</option>
                                <option value="S">Sent</option>
                            </select>
                            {/* <label>Invoice: </label>
                            <select></select> */}
                            <input type="submit" value="Filter" />
                        </form>
                        {/* <button onClick={resetfilter}>Clear Filter</button> */}
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Length</th>
                                <th>Fee</th>
                                <th>Status</th>
                            </tr>
                            {/* For batch update of appointment status */}
                            {/* <tr>
                                <th></th>
                                <th></th>
                                <label>Mark All:</label>
                                <select onChange={(e) => handleChange(e, true)}>
                                    <option value="S">Scheduled</option>
                                    <option value="C">Completed</option>
                                    <option value="X-C">Cancelled - Charge</option>
                                    <option value="X-N">Cancelled - No Charge</option>
                                </select>
                            </tr> */}
                            {appointments.map((appointment, i) => 
                                <>
                                    <tr>
                                        <td><Link to={`/appointments/${appointment.id}/`}>{formatDateTime(appointment.date_time)}</Link></td>
                                        <td><Link to={`/customers/${appointment.customer.id}/`}>{appointment.customer_name}</Link></td>
                                        <td>{ isBeingEditedLengthId == appointment.id ? 
                                            <>
                                                <input value={appointment.length} onChange={(e) => handleLengthChange(e, appointment, i, "length")} />
                                                <button onClick={(e) => saveAppointmentData(e, appointment, "length")}>Save</button>
                                            </>
                                            : 
                                            <span onClick={() => setIsBeingEditedLengthId(appointment.id)}>{appointment.length}</span> } hours
                                        </td>
                                        <td>${ isBeingEditedFeeId == appointment.id ? 
                                            <>
                                                <input value={appointment.fee} onChange={(e) => handleLengthChange(e, appointment, i, "fee")} /> 
                                                <button onClick={(e) => saveAppointmentData(e, appointment, "fee")}>Save</button>
                                            </>
                                            :
                                            <span onClick={() => setIsBeingEditedFeeId(appointment.id)}>{appointment.fee}</span>
                                        }</td>
                                        <td>
                                            <select onChange={handleChange}>
                                                <option selected={appointment.status == 'S'} value={`${appointment.id}-status:S`}>Scheduled</option>
                                                <option selected={appointment.status == 'C'} value={`${appointment.id}-status:C`}>Completed</option>
                                                <option selected={appointment.status == 'X-C'} value={`${appointment.id}-status:X-C`}>Cancelled - Charge</option>
                                                <option selected={appointment.status == 'X-N'} value={`${appointment.id}-status:X-N`}>Cancelled - No Charge</option>
                                            </select>
                                        </td>
                                        <td>
                                            { appointment.appointment_note == null &&  
                                                <button onClick={(e) => navigate(`/appointment_notes/create/${appointment.id}`)}>Add Note</button>
                                            }
                                            { appointment.appointment_note != null &&  appointment.appointment_note.status == 'I' &&
                                                <>
                                                    <button onClick={(e) => navigate(`/appointment_notes/${appointment.appointment_note.id}`)}>Review Note</button>
                                                    <button onClick={(e) => sendEmail(e, appointment)}>Send Note</button>
                                                </>
                                            }
                                            { appointment.appointment_note != null &&  appointment.appointment_note.status == 'S' &&
                                                <>
                                                    <button onClick={(e) => navigate(`/appointment_notes/${appointment.appointment_note.id}`)}>View Note</button>
                                                </>
                                            }
                                        </td>
                                        <td>
                                            { appointment.invoice == null &&  
                                                <button onClick={(e) => createInvoice(e, appointment)}>Add Invoice</button>
                                            }
                                            { appointment.invoice != null &&  !appointment.invoice.sent &&
                                                <>
                                                    <button onClick={(e) => navigate(`/invoices/${appointment.invoice.id}`)}>Review Invoice</button>
                                                    <button onClick={(e) => sendInvoice(e, appointment)}>Send Invoice</button>
                                                </>
                                            }
                                            { appointment.invoice != null &&  appointment.invoice.sent &&
                                                <>
                                                    <button onClick={(e) => navigate(`/invoices/${appointment.invoice.id}`)}>View Invoice</button>
                                                </>
                                            }
                                            {
                                                ['C', 'X-C'].includes(appointment.status) &&
                                                <button onClick={() => navigate(`/payments/create/customer/${appointment.customer.id}/`)}>Add Payment</button>
                                            }
                                        </td>
                                    </tr>
                                </>
                            )}
                        </thead>
                    </table>
                    <div className="container-v table">
                        {/* <DatePicker 
                            setAppointments={setAppointments}
                            setIsLoading={setIsLoading}
                            authTokens={authTokens}
                        /> */}
                    
                        {/* {appointments.map((appointment, i) => 
                        <>
                            <AppointmentListRow appointment={appointment} key={appointment.id} tableDisplay={true}/>
                        </>
                        )} */}
                        </div>
                    </div>
                }
      </div>

    </>
    );
  }