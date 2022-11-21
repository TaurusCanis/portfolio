import { Link } from "react-router-dom";

export default function CrudButton({ path, label}) {
    return (
        <Link 
            to={path}>
            <button className="crud-button edit-button">{label}</button>
        </Link> 
    );
}