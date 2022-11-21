import { useState, useEffect } from "react";
import { getData } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export default function Statement() {
    const [statement, setStatement] = useState();
    const [isLoading, setIsLoading] = useState(true);
    let params = useParams();
    const { authTokens } = useContext(AuthContext);
    const [appointments, setAppointments] = useState();

    console.log("params.statementId: ", params.statementId);



    try {
        useEffect(() => {
            getData((res) => {
                setStatement(res);
                setIsLoading(false);
                }, `statements/${params.statementId}`, authTokens)
        }, []);
    } catch (e) {
        console.log("ERROR: " + e);
    }

    return (
        <>
        { !isLoading &&
            <>
                <div>Statment</div>
                <div>Customer: { statement.customer }</div>
                <div>Date: { statement.statement_date }</div>
                <div> From: { statement.start_date } To: { statement.end_date }</div>
                <div>Previous Statement: ${ statement.previous_statement || "0.00" }</div>
                <div>Previous Payment: ${ statement.previous_payment || "0.00" }</div>
                <div>New Charges: ${ statement.new_charges || "0.00" }</div>
                <h3>Appointments</h3>
                <div>
                    { statement.appointments.map((appointment, i) =>
                        <div>
                            <span>{ appointment.date_time }</span>
                            <span>${ appointment.fee }</span>
                        </div>
                    )}
                </div> 
            </>
        }
        </>
    );
}