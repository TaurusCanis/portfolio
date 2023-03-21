import { Link } from "react-router-dom";


export default function Navbar() {
    return (
        <nav className="container-h">
            <div className="nav-items-left">
                <Link to="/" className="nav-link">Mood Meter</Link>
            </div>
            <div className="nav-items-right">
                <Link to="/" className="nav-link">Logout</Link>
            </div>
            
        </nav>
    );
}