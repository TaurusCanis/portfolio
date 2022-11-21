import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getData } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import CustomerName from "../components/CustomerName";

export default function DeleteCustomer() {
    let params = useParams();

    const [customer, setCustomer] = useState({});
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
        if (authTokens) {
            fetch(`${BASE_URL}customers/${params.customerId}/`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                }
            })
            .then(res => res.json())
            .then(json => {
                setCustomer(json);
                setIsLoading(false);
            })
        }
        else {
            navigate("/");
        }
    }, [])

    async function handleDelete() {
        const res = await fetch(`${BASE_URL}customers/${customer.id}/`, {
            method: "DELETE",
            headers: {
              'Authorization': `Token ${authTokens}`,
            }
          });
          if (res.ok) navigate("/customers");
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
                    <CustomerName name={`${customer.last_name}, ${customer.first_name}`} id={customer.id} />
                </div>
                
                <Link 
                    to={`/customers/${customer.id}`}>
                    Cancel
                </Link> 
                <button onClick={handleDelete}>
                    Delete Customer
                </button>
            </div>

            </>
            }
        </>
    );
  }