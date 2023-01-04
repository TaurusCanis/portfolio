import { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
  const { logoutUser, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  // function logout() {
  //   logoutUser();
  //   navigate("/");
  // }

    return (
    <nav className="container-h">
        <div className="nav-group-left">
          <Link className="nav-item nav-group-right" to="/">Home</Link>
          { authTokens &&
          <>
            <Link className="nav-item" to="/customers">Customers</Link> |{" "}
            <Link className="nav-item" to="/dashboard">Dashboard</Link> |{" "}
            <Link className="nav-item" to="/appointments">Appointments</Link> |{" "}
            <Link className="nav-item" to="/payments">Payments</Link> 
            <Link className="nav-item" to="/invoices">Invoices</Link> 
            <Link className="nav-item" to="/statements">Statements</Link> 
            <Link className="nav-item" to="/prepayments">Prepayments</Link> 
            {/* <Link className="nav-item" to="/settings">Settings</Link> |{" "} */}
            </>
          }
        </div>
        { 
          !authTokens 
          ? <div className="nav-group-right">
              <Link className="nav-item" to="/login">Log In</Link> |{" "}
              <Link className="nav-item" to="/signup">Sign Up</Link>
            </div>
          : <div className="nav-group-right">
              
              <Link className="nav-item" onClick={ logoutUser }>Logout</Link> 
            </div>
        }
      </nav>
    );
}