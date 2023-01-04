import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import InvoiceListRow from "../components/InvoiceListRow";
import AuthContext from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

export default function Invoice() {
    const [invoice, setInvoice] = useState();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    let params = useParams();
    const navigate = useNavigate();
    const [deleteView, setDeleteView] = useState(false)

    useEffect(() => {
        fetch(`${BASE_URL}invoices/${params.invoiceId}/`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => res.json())
        .then(json => {
            console.log("JSON: ", json);
            setInvoice(json);
            setIsLoading(false);
        })
    }, []);

    function sendInvoice(e) {
        e.preventDefault();
        fetch(`${BASE_URL}invoices/${params.invoiceId}/send_invoice_email/`, {
            method: "POST",
            headers: {
                'Authorization': `Token ${authTokens}`,
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
        .then(res => res.json())
    }

    function handleDelete(e) {
        e.preventDefault();
        fetch(`${BASE_URL}invoices/${params.invoiceId}/`, {
            method: "DELETE",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => res.json())
        .then(json => {
            navigate("/dashboard");
        });
    }

    return (
        <>
            { !isLoading && invoice ?
            <>
                <h2>Invoice</h2>
                <InvoiceListRow invoice={invoice} />
                { invoice.sent ?
                    <button>View</button>
                :
                    <>
                    { deleteView ?
                        <>
                            <div>Are you sure you want to delete this invoice?</div>
                            <button onClick={handleDelete}>Yes, Delete</button>
                        </>
                    :
                        <>
                            <button onClick={() => setDeleteView(true)}>Delete</button>
                            <button onClick={sendInvoice}>Send</button>
                        </>
                    }
                        
                    </>
                }
            </>
            :
            <>
            </>
            }
        </>
    )
}