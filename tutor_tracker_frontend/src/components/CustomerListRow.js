import { Link } from "react-router-dom";

export default function CustomerListRow({ customer, key }) {
    return (
            <Link 
                className="table-row"
                key={key}
                to={`/customers/${customer.id}`}>
                {customer.last_name}, {customer.first_name}
            </Link>  
    );
}