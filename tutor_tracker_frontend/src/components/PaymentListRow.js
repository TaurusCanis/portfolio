import { Link } from "react-router-dom";

export default function PaymentListRow({ payment, key }) {
    return (
        <Link 
            className="table-row"
            key={key}
            to={`/payments/${payment.id}`}>
            {payment.customer_name} - {payment.date} - ${payment.amount}
        </Link> 
    )
}