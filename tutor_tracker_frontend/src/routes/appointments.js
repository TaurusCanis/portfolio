import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getAppointmentStatus, getData } from "../util/helpers"
import { useContext } from "react";
import { useAppContext } from "../util/context";
import AuthContext from "../context/AuthContext";
import DatePicker from "../components/DatePicker";
import AppointmentListRow from "../components/AppointmentListRow";
import CreateButton from "../components/CreateButton";

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (authTokens) {
            fetch(BASE_URL + "appointments/", {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                setAppointments(json);
                setIsLoading(false);
            });
        }
        else {
            navigate("/");
        }
    }, [])

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + " " + date.toLocaleTimeString('en-US');
    }

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
                    <div className="container-v table">
                        {/* <DatePicker 
                            setAppointments={setAppointments}
                            setIsLoading={setIsLoading}
                            authTokens={authTokens}
                        /> */}
                    
                        {appointments.map((appointment, i) => 
                        <>
                            <AppointmentListRow appointment={appointment} key={i} tableDisplay={true}/>
                        </>
                        )}
                        </div>
                    </div>
                }
      </div>

    </>
    );
  }