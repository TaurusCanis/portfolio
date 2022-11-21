import { useState, useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getAppointmentStatus, getData } from "../util/helpers"
import { useSearchParams, Link, useLocation } from "react-router-dom";
import StatementListRow from "../components/StatementListRow";
import CustomerName from "../components/CustomerName";

export default function Statements() {
    const [statements, setStatements] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);
    let [searchParams, setSearchParams] = useSearchParams();
    const data = {};
    const location = useLocation();

    console.log("location--->>>>: ", location.state)

    for (let entry of searchParams.entries()) {
        console.log("ENTRY[0]: ", entry[0]);
        console.log("ENTRY[1]: ", entry[1]);
        data[entry[0]] = entry[1];
      }

      console.log("DATA: ", data)

    try {
        useEffect(() => getData((res) => {
            setStatements(res);
            setIsLoading(false);
        }, 'statements', authTokens, data), []);
    } catch (e) {
        console.log("ERROR: " + e);
    }

    

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
                        <StatementListRow statement={statement} key={i} tableDisplay={true}/>
                    )
                }
            </div>
            </>
        }
        </>
    );
}