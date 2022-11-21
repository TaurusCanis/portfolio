import { useState, useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getData } from "../util/helpers"
import { useSearchParams, Link, useLocation } from "react-router-dom";
import StatementListRow from "../components/StatementListRow";
import CustomerName from "../components/CustomerName";

export default function Invoice() {
    const [invoices, setInvoices] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);
    const location = useLocation();

    try {
        useEffect(() => getData((res) => {
            console.log("RES: ", res);
            setInvoices(res);
            setIsLoading(false);
        }, 'invoices', authTokens), []);
    } catch (e) {
        console.log("ERROR: " + e);
    }

    return (
        <>
        { !isLoading &&
        <>
            <h2>Invoices</h2>
            <h3>{ location.state != null && <CustomerName name={location.state.customerName} id={invoices[0].customer} /> }</h3>
            <Link to="/invoices/create">
                <button>
                    Create New Invoice
                </button>
            </Link>
            <div className="table container-v">
                {
                    invoices.map((invoice, i) => 
                        <StatementListRow statement={invoice} key={i} tableDisplay={true}/>
                    )
                }
            </div>
            </>
        }
        </>
        // <>
        // { !isLoading &&
        // <>
        //     <div>Invoices</div>
        //     <Link to="/invoices/create">Create New Invoice</Link> <br></br>
        //     <div>
        //         {
        //             invoices.map((invoice, i) => 
        //                 <div key={i}>
        //                     <span>
        //                         Date: {invoice.date_sent}  
        //                     </span>
        //                     <span>
        //                         Amount: ${invoice.amount}  
        //                     </span>
        //                     <Link 
        //                         // style={{display:'block'}}
        //                         key={i}
        //                         to={`/invoices/${invoice.id}`}>
        //                         View
        //                     </Link>  
        //                 </div>
        //             )
        //         }
        //     </div>
        //     </>
        // }
        // </>
    );
}