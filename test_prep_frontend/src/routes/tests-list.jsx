import { useContext } from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../AppContext";

export default function TestsList() {
    const [testIds, setTestIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { BASE_URL, authTokens } = useContext(AppContext);
    const [completedTestAttempts, setCompletedTestAttempts] = useState([]);
    const [inProgressTestAttempts, setInProgressTestAttempts] = useState([]);
    const [testAttemptIds, setTestAttemptIds] = useState();
    const [tests, setTests] = useState();
    let navigate = useNavigate();

    function testIdsLoader() {
        return [1,2,3,4];
    }

    useEffect(() => {
        Promise.all([
            fetch(`${BASE_URL}tests/`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                console.log("TESTS: ", json)
                setTests(json);
                setTestIds(json.map(test => test.id));
            }),
            fetch(`${BASE_URL}student_test_attempts/`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                console.log("TEST ATTEMPTS: ", json);
                setTestAttemptIds(json.map(attempt => attempt.id));
                setCompletedTestAttempts(json.map(testAttempt => {
                    if (testAttempt.is_completed) return testAttempt.test; 
                }));
                setInProgressTestAttempts(json.map(testAttempt => {
                    if (!testAttempt.is_completed) return testAttempt.test;
                }));
            })
        ])
        .then(res => {
            console.log("Promise.all RES: ", res);
            setIsLoading(false);
        })
    }, []);

    function navigateTo(e, path) {
        e.preventDefault();
        navigate(path);
    }

    return (
        <>
        { !isLoading &&
        <>
            <h2 className="heading center-heading">Tests List</h2>
            <div className="body-div">
                <div className="container-v test-list">
                {
                    tests.map(test => (
                        
                            test.test_attempt.length == 0 ?
                            <div className="test-list-item">
                                <span>Test {test.id}</span>
                                <button onClick={(e) => navigateTo(e, `${test.id}`)}>
                                    Begin
                                </button>
                            </div>
                            :
                            <>
                            {
                                test.test_attempt[0].is_completed ?
                                <div className="test-list-item">
                                    <span>Test {test.id}</span>
                                    <button onClick={(e) => navigateTo(e, `${test.id}/results/`)}>
                                        View Results
                                    </button>
                                </div> 
                                :
                                <div className="test-list-item">
                                    <span>Test {test.id}</span>
                                    <button onClick={(e) => navigateTo(e, `${test.id}`)}>
                                        Resume
                                    </button>
                                </div>
                            }
                            </>
                        
                    ))
                }
                </div>
            </div>
        </>
        }
        </>
    );
}

