import { useState, useEffect } from "react";
import { getData } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import CrudButton from "../components/CrudButton";

export default function Payment() {
    const [payment, setPayment] = useState();
    const [isLoading, setIsLoading] = useState(true);
    let params = useParams();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authTokens) {
            fetch(`${BASE_URL}payments/${params.paymentId}/`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                setPayment(json);
                setIsLoading(false);
            })
        }
        else {
            navigate("/");
        }
    }, [])

    return (
        <>
        { !isLoading &&
        <div className="container-v">
            <h3>Payment Detail</h3>
            <div className="model-display">
                <div>Customer: { payment.customer_name }</div>
                <div>Date: { payment.date }</div>
                <div>Amount: ${ payment.amount || "0.00" }</div>
                <div className="container-h list-row">
                    <CrudButton path={`/payments/${payment.id}/edit`} label="Edit Payment" />
                    <CrudButton path={`/payments/${payment.id}/delete`} label="Delete Payment" />
                </div>
            </div>
        </div>
        }
        </>
    );
}