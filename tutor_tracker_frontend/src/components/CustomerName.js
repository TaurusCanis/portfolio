import { Link } from "react-router-dom";

export default function CustomerName({ name, id }) {
    return (
        <Link to={`/customers/${id}`}>
            {name}
        </Link>
    );
}