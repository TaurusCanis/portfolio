import { useState, useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getData } from "../util/helpers"
import { useSearchParams, Link, Navigate, useNavigate } from "react-router-dom";
import PaymentListRow from "../components/PaymentListRow";

export default function Preayments() {
    const [payments, setPayments] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { authTokens, BASE_URL } = useContext(AuthContext);
    let [searchParams, setSearchParams] = useSearchParams();
    const data = {};
    const navigate = useNavigate();

    for (let entry of searchParams.entries()) {
        data[entry[0]] = entry[1];
      }

    useEffect(() => {
        if (authTokens) {
            fetch(BASE_URL + "prepayments/", {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                }
            })
            .then(res => res.json())
            .then(json => {
                setPayments(json);
                setIsLoading(false);
            });
        }
        else {
            navigate("/");
        }
    }, [])

    

    return (
        <>
      
        { isLoading &&
          <div className="container-v">
            <div class="loader"></div>
          </div>
        }
      
      <div className="container-v list-view">
        <h3>Payments</h3>
        { !isLoading && payments.length !== 0 &&
            <>
            
            {/* <CreateButton url="/payments/create" label="Create New Payment" /> */}
            <Link to="/prepayments/create">
            <button>Create New Prepayment</button>
            </Link>
            <div className="table container-v">
            {payments.map((payment, key) =>
            <>
            <Link 
                className="table-row"
                key={key}
                to={`/prepayments/${payment.id}`}>
                {payment.customer_name} - {payment.date} - ${payment.amount}
            </Link> 
            </>
            )}
            </div>
            </>
        }
        { !isLoading && payments.length == 0 &&
            <>
                <div>No payments!</div>
                <Link to="/prepayments/create">
                    <button>
                    Create New Preayment
                    </button>
                </Link> 
            </> 
        }
      </div>

      </>

    );
}