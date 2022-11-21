import { Link } from "react-router-dom";

export default function StatementListRow({ statement, key, tableDisplay }) {
    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + " " + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    return (
            <Link 
                className={tableDisplay ? "table-row" : ""}
                key={key}
                to={`/statements/${statement.id}`}>
                {/* <span>{formatDateTime(statement.statement_date)}</span> */}
                <span>
                     Date: {statement.statement_date } {" "}   
                 </span>
                 <span>
                     Amount: ${statement.current_balance}  
                 </span>
            </Link>  
    );
}