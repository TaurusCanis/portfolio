import { useContext } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../AppContext";
import Button from "../components/Button";

export default function Dashboard() {
    const [userData, setUserData] = useState();
    const [completedTestAttempts, setCompletedTestAttempts] = useState();
    const [inProgressTestAttempts, setInProgessTestAttempts] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { BASE_URL, authTokens } = useContext(AppContext);
    const navigate = useNavigate();

    function sortTestAttempts(existing_attempts_for_tests) {
        console.log(existing_attempts_for_tests)
        let cta = [];
        let ipta = [];
        existing_attempts_for_tests.forEach(ta => {
            if (ta.is_completed) cta.push(ta);
            else ipta.push(ta)
        });
        return [cta, ipta];
    }

    useEffect(() => {
        fetch(`${BASE_URL}users/`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            setUserData(json);
            let [cta, ipta] = sortTestAttempts(json[0]['existing_attempts_for_tests']);
            setCompletedTestAttempts(cta);
            setInProgessTestAttempts(ipta);
            setIsLoading(false);
            return json;
        })
    }, []);

    return (
        <div className="container-v dashboard">
        { !isLoading &&
            <>
            { inProgressTestAttempts.length > 0 ?
                <>
                <Button onClick={() => navigate("/tests")} className="center">
                    Take a Practice Test
                </Button>
                {/* <button onClick={() => navigate("/tests")} className="center">
                    Take a Practice Test
                </button> */}
                </>
                :
                <>
                { completedTestAttempts.length == 0 ?
                    <>
                        {/* <h2>You haven't taken a test yet!</h2> */}
                        <Button onClick={() => navigate("/tests")} className="center">
                            Take a Practice Test
                        </Button>
                        {/* <button onClick={() => navigate("/tests")} className="center">
                            Take a Practice Test
                        </button> */}
                    </>
                    :
                    <>
                        <div className="container-v center-v">
                            <Button onClick={() => navigate("/tests")} className="center">
                                Take Another Practice Test
                            </Button>
                            {/* <button onClick={() => navigate("/tests")} className="center">
                                Take Another Practice Test
                            </button> */}
                        </div>
                        <div className="container-v center">
                            <h3 className="center-heading">Completed Tests</h3>
                            {completedTestAttempts.map(t => (
                                <div>
                                    <span><span>Practice Test</span>  <span>{t.test}</span></span>
                                    <Button onClick={() => navigate(`/tests/${t.test}/results/`)}>
                                        View Results
                                    </Button>
                                    {/* <button onClick={() => navigate(`/tests/${t.test}/results/`)}>
                                        View Results
                                    </button> */}
                                </div>
                            ))}
                        </div>
                    </>
                }
                </>
            } 
            </> 
        }
        </div>
    );
}