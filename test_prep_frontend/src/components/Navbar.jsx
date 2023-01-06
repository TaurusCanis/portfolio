import { Link } from "react-router-dom";
import AppContext from "../AppContext";
import { useContext } from "react";

export default function Navbar() {
    const { authTokens, logoutUser } = useContext(AppContext);
    return (
        <nav>
            <div className="nav-left">
                <Link to="/" className="nav-link">
                    Home
                </Link>
                { authTokens &&
                    <>
                        <Link to="/dashboard" className="nav-link">
                            Dashboard
                        </Link>
                        <Link to="/tests" className="nav-link">
                            Tests
                        </Link>
                    </>
                }
            </div>
            <div className="nav-right">
                { authTokens ?
                    <button onClick={logoutUser}>Logout</button>
                    :
                    <>
                        <Link to="/login" className="nav-link">
                            Login
                        </Link>
                        <Link to="/signup" className="nav-link">
                            Signup
                        </Link>
                    </>
                }
            </div>
        </nav>
    );
}