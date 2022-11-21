import { useState, useEffect } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { getData } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import AppointmentListRow from "../components/AppointmentListRow";
import PanelRow from "../components/PanelRow";
import AppointmentListRowDate from "../components/AppointmentListRowDate";

export default function Customer() {
    let params = useParams();

    const [customer, setCustomer] = useState({});
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (authTokens) {
            fetch(`${BASE_URL}customers/${params.customerId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                },
            })
            .then(res => res.json())
            .then(json => {
                setCustomer(json);
                setIsLoading(false);
                console.log("response: ", json);
            });
        }
        else {
            navigate("/");
        }
    }, [])

    return (
        <>
            { isLoading &&
                <div class="loader"></div>
            }
            { !isLoading &&
            <>
                <h2>{customer.last_name}, {customer.first_name}</h2>
                    <div className="container-v action-header">
                        <h3>Actions</h3>
                        <div className="container-h action-header-content">
                            <div>
                                <Link className="action-header-content-link"
                                    to={`/customers/${customer.id}/edit`}>
                                        Edit Customer
                                </Link>
                                <Link 
                                    to={`/customers/${customer.id}/delete`}>
                                        Delete Customer
                                </Link> 
                            </div>
                            <div>
                                <Link className="action-header-content-link"
                                    to={'/createAppointment'}
                                    state={{ 'customer': customer }}
                                    >
                                            Add an Appointment
                                </Link>
                                <Link 
                                    to={`/appointments/`}>
                                        View Appointments
                                </Link> 
                            </div>
                            <div>
                                <Link className="action-header-content-link"
                                    to={'/payments/create/'}
                                    state={{ 'customer': customer }}
                                    >
                                            Add a Payment
                                </Link>
                                <Link className="action-header-content-link"
                                    to={`/payments/`}>
                                        View Payments
                                </Link>  
                            </div>
                        </div>
                    </div>
                <div className="container-h dashboard-row">
                    <div className="dashboard-panel">
                        <h3>Customer Information</h3>
                        <div className="dashboard-panel-content">
                            <PanelRow label="Customer" value={`${customer.last_name}, ${customer.first_name}`} />
                            <PanelRow label="Email" value={customer.email_primary} />
                            <PanelRow label="Current Balance" value={customer.current_balance} />
                        </div>
                    </div>
                    <div className="dashboard-panel">
                        <h3>Appointment Information</h3>
                        <div className="dashboard-panel-content">
                            <div>
                            <div className="list-row">
                                <span>Last Appointment: </span>{ customer.last_appointment != null ?
                                                    <AppointmentListRowDate appointment={customer.last_appointment} key={0} />
                                                    :
                                                    <span>
                                                    No Appointment Scheduled
                                                    </span>
                                                    }
                            </div>
                            </div>
                            <div>
                                <div className="list-row">
                                    <span>Next Appointment: </span> { customer.next_appointment != null ?
                                                        <AppointmentListRowDate appointment={customer.next_appointment} key={0} />
                                                        :
                                                        <span>
                                                        No Appointment Scheduled
                                                        </span>
                                                        }
                                </div>
                            </div>
                             
                        </div>
                    </div>
                </div>
            </>
            }
        </>
    );
  }