import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getData } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import CustomerName from "../components/CustomerName";

export default function DeletePayment() {
    let params = useParams();

    const [payment, setPayment] = useState({});
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
        if (authTokens) {
            fetch(`${BASE_URL}payments/${params.paymentId}/`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`,
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

    async function handleDelete() {
        const res = await fetch(`${BASE_URL}payments/${payment.id}/`, {
            method: "DELETE",
            headers: {
              'Authorization': `Token ${authTokens}`,
            }
          });
          if (res.ok) navigate("/payments");
          else alert("There was a problem!");
    }

    return (
        <>
            { isLoading &&
                <span>LOADING....</span>
            }
            { !isLoading &&
            <>
            <h2>Are you sure you want to delete?</h2>
            <div className="form-single">
                <div>
                    <CustomerName name={payment.customer_name} id={payment.customer} />
                </div>
                
                <Link 
                    to={`/payments/${payment.id}`}>
                    Cancel
                </Link> 
                <button onClick={handleDelete}>
                    Delete Payment
                </button>
            </div>

            </>
            }
        </>
    );
  }