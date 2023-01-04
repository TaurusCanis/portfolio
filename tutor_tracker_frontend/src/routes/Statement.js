import { useState, useEffect } from "react";
import { getData } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export default function Statement() {
    const [statement, setStatement] = useState();
    const [isLoading, setIsLoading] = useState(true);
    let params = useParams();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [appointments, setAppointments] = useState();

    console.log("params.statementId: ", params.statementId);



    // try {
    //     useEffect(() => {
    //         getData((res) => {
    //             setStatement(res);
    //             setIsLoading(false);
    //             }, `statements/${params.statementId}`, authTokens)
    //     }, []);
    // } catch (e) {
    //     console.log("ERROR: " + e);
    // }

    useEffect(() => {
        fetch(`${BASE_URL}statements/${params.statementId}`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => res.json())
        .then(json => {
            setStatement(json);
            console.log("statement: ", json)
            setIsLoading(false);
            return json;
        })
    }, [])

    return (
        <>
        { !isLoading &&
            <>
                <div>Statment</div>
                <div>Customer: { statement.customer }</div>
                <div>Date: { statement.statement_date }</div>
                <div> From: { statement.start_date } To: { statement.end_date }</div>
                <div>Previous Statement: ${ statement.previous_balance || "0.00" }</div>
                <div>Previous Payment: ${ statement.payment_totals || "0.00" }</div>
                <div>New Charges: ${ statement.incurred_charges || "0.00" }</div>
                <div>Balance Due: ${ statement.balance_due || "0.00" }</div>
                <div>
                    <h3>Appointments</h3>
                    { statement.appointments.map((appointment, i) =>
                        <div>
                            <span>{ appointment.date_time }</span>
                            <span>${ appointment.fee }</span>
                        </div>
                    )}
                </div> 
                <div>
                    <h3>Payments</h3>
                    { statement.payments.map((payment, i) =>
                        <div>
                            <span>{ payment.date }</span>
                            <span>${ payment.amount }</span>
                        </div>
                    )}
                </div> 
            </>
        }
        </>
    );
}