import { Link } from "react-router-dom";

export default function CreateButton({ url, label}) {
    return (
        <Link to={url}>
          <button className="create-button">{label}</button>
        </Link>
    );
}