import { useState, useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getAppointmentStatus, getData } from "../util/helpers"
import { useSearchParams, Link, useLocation, useNavigate } from "react-router-dom";
import CustomerName from "../components/CustomerName";

export default function Statements() {
    const [statements, setStatements] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { authTokens, BASE_URL } = useContext(AuthContext);
    let [searchParams, setSearchParams] = useSearchParams();
    const data = {};
    const location = useLocation();
    let navigate = useNavigate();

    console.log("location--->>>>: ", location.state)

    for (let entry of searchParams.entries()) {
        console.log("ENTRY[0]: ", entry[0]);
        console.log("ENTRY[1]: ", entry[1]);
        data[entry[0]] = entry[1];
      }

      console.log("DATA: ", data)

    // try {
    //     useEffect(() => getData((res) => {
    //         setStatements(res);
    //         setIsLoading(false);
    //     }, 'statements', authTokens, data), []);
    // } catch (e) {
    //     console.log("ERROR: " + e);
    // }

    useEffect(() => {
        fetch(`${BASE_URL}statements/`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => res.json())
        .then(json => {
            setStatements(json);
            setIsLoading(false);
            console.log("STATEMENTS: ", json)
            return json;
        })
    }, [])

    

    return (
        <>
        { isLoading &&
          <div class="loader"></div>
        }
        { !isLoading &&
        <>
            <h2>Statements</h2>
            <h3>{ location.state != null && <CustomerName name={location.state.customerName} id={statements[0].customer} /> }</h3>
            <Link to="/statements/create">
                <button>Create a New Statement</button>
            </Link>
            <div className="table container-v">
                {
                    statements.map((statement, i) => 
                        <div>
                            {statement.customer_name}: {statement.start_date} - {statement.end_date}: ${statement.balance_due}
                            <button onClick={() => navigate(`/statements/${statement.id}`)}>View</button>
                        </div>
                    )
                }
            </div>
            </>
        }
        </>
    );
}