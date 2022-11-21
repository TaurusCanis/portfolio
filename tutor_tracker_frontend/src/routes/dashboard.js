import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getData } from "../util/helpers";
import { Link, useNavigate } from "react-router-dom";
import AppointmentListRow from "../components/AppointmentListRow";
import FinancialPanelDataRow from "../components/FinancialPanelDataRow";
import AppointmentPanelDataRow from "../components/AppointmentPanelDataRow";
import AppointmentList from "../components/AppointmentList";

export default function Dashboard() {
    const { authTokens, userId, currentUserData, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const today = new Date();
    const [nextAppointment, setNextAppointment] = useState({});
    const [user,setUser] = useState({});
    const [dataHasUpdated, setDataHasUpdated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      if (authTokens) {
        fetch(BASE_URL + "users/" + userId + "/", {
          method: "GET",
          headers: {
              'Authorization': `Token ${authTokens}`,
          },
      })
      .then(res => res.json())
      .then(json => {
          console.log("USER DATA**********: ", json);
          setUser(json);
          setIsLoading(false);
          setDataHasUpdated(false);
      });
      }
      else {
        navigate("/");
      }
      
    }, [dataHasUpdated])

    return (
        <>
        { isLoading &&
          <div className="container-v">
            <div class="loader"></div>
          </div>
        }
          { !isLoading && 
          // <div className="container-v">
          <>
            <h2>Welcome, {user.username}!</h2>
            <div className="container-h dashboard-row">
              <div className="dashboard-panel">
                <h3>Financials</h3>
                <div className="dashboard-panel-content">
                  <FinancialPanelDataRow data={user.accounts_receivable} label="Accounts Receivable" />
                  <FinancialPanelDataRow data={user.earned_revenue_current_month} label="Earned Revenue (current month)" />
                  <FinancialPanelDataRow data={user.expected_revenue_next_thirty_days} label="Expected Revenue (next 30 days)" />
                </div>
                <button>
                  <Link to="/payments/create" >
                    Add a Payment
                  </Link>
                </button>
              </div>
              <div className="dashboard-panel">
                  <h3>Next Appointment</h3>
                  <div className="dashboard-panel-content">
                      { user.next_appointment.date_time == null ?
                        <div className="container-v panel-value-no-data flex-center">
                          <h4>No Upcoming Appointments Scheduled</h4>
                          <button>
                            <Link to="/createAppointment" >
                              Add an Appointment
                            </Link>
                          </button>
                        </div>
                        :
                        <div className="container-h flex-center">
                          <div className="container-v flex-center">
                            <AppointmentListRow appointment={user.next_appointment} key={0}/>
                            <button>
                              <Link to="/createAppointment">
                                Add an Appointment
                              </Link>
                            </button>
                          </div>
                        </div>
                      }
                  </div>
                </div>
            </div>
          
            <div className="container-h dashboard-row">
              <div className="dashboard-panel">
                  <h3>This Week's Completed Appointments</h3>
                  { user.completed_appointments_this_week.length > 0 ?
                    <AppointmentList setDataHasUpdated={setDataHasUpdated} appointments={user.completed_appointments_this_week} />
                  :
                    <h4>No Appointments Completed for this Week</h4>
                  } 
              </div>
              <div className="dashboard-panel">
                <h3>This Week's Upcoming Appointments</h3>
                { user.upcoming_appointments_this_week.length > 0 ?
                  < AppointmentList setDataHasUpdated={setDataHasUpdated} appointments={user.upcoming_appointments_this_week} />
                :
                  <h4>No Appointments Scheduled for this Week</h4>
                }  
                </div>
            </div>
          {/* </div> */}
          </>
          }
        </>
      );
  }