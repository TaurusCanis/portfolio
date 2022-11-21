import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../util/context";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import CustomerListRow from "../components/CustomerListRow";
import CreateButton from "../components/CreateButton";

export default function Customer() {
    const [customers, setCustomers] = useState([]);
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      if (authTokens) {
        fetch(BASE_URL + "customers/", {
          method: "GET",
          headers: {
              'Authorization': `Token ${authTokens}`,
            },
      })
      .then(res => res.json())
      .then(json => {
          setCustomers(json);
          setIsLoading(false);
      })
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
      
        { !isLoading && customers.length !== 0 &&
        <>
        <h3>Customers</h3>
        {/* <CreateButton url="/createCustomer" label="Create New Customer" /> */}
        <Link to="/createCustomer">
          <button>Create New Customer</button>
        </Link>
        <div className="table container-v">
        {customers.map((customer, key) =>
        <>
          <CustomerListRow customer={customer} key={key}/>
        </>
        )}
        </div>
        </>
      }
      </div>
      <div>
        { !isLoading && customers.length === 0 &&
        <>
          <div>No customers!</div>
          <Link to="/createCustomer">Create New Customer</Link> 
        </> 
        }
      </div>
      </>
    );
  }