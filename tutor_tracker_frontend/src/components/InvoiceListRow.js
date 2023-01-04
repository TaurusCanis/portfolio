import { Link } from "react-router-dom";

export default function InvoiceListRow({ invoice, key, tableDisplay }) {
    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + " " + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    return (
            <Link 
                className={tableDisplay ? "table-row" : ""}
                key={key}
                to={`/invoices/${invoice.id}`}>
                {/* <span>{formatDateTime(statement.statement_date)}</span> */}
                <span>
                    Customer: {invoice.customer_name}
                </span>
                <span>
                     Date: {invoice.date } {" "}   
                </span>
                <span>
                    Amount: ${invoice.amount}  
                </span>
            </Link>  
    );
}