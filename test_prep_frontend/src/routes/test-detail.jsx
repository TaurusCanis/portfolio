import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppContext from "../AppContext";
import testData from "../practice_tests/SSAT_Practice_Test_1_Official.json";
import Button from "../components/Button";

export default function TestDetail() {
    const params = useParams();
    const [sections, setSections] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { BASE_URL, authTokens } = useContext(AppContext);
    const [testAttempt, setTestAttempt] = useState({ "is_completed": false });
    const [inactiveSections, setInactiveSections] = useState([]);
    const navigate = useNavigate();

    function formatSection(name) {
        const sectionNameSplit = name.split("_");
        let formattedName = "";
        formattedName = sectionNameSplit[0][0].toUpperCase() + sectionNameSplit[0].slice(1) 
        if (sectionNameSplit[1]) {
            formattedName += " " + sectionNameSplit[1];
        }
        return formattedName;
    }

    function getTestSections() {
        return Object.keys(testData['sections'])
    }

    // useEffect(() => {
    //     setSections(getTestSections());
        
    // }, [])

    useEffect(() => {
        console.log("FUCK")
        fetch(`${BASE_URL}student_test_attempts?test_id=${params.testId}`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`,
                "Accept": "application/json",
                "Content-Type":"application/json",
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log("BARK: ", json);
            console.log("length: ", json.length)
            if (json.length > 0) {
                setTestAttempt(json[0]);
                if (json[0].student_response.length > 0) {
                    setInactiveSections(json[0].student_response.map(response => response.section));
                }
            }
            setIsLoading(false);
            setSections(getTestSections());
            return json;
        })
    }, []);

    function handleSubmit(e, section) {
        e.preventDefault();
        fetch(`${BASE_URL}student_test_attempts/`, {
            method: "POST",
            headers: {
                'Authorization': `Token ${authTokens}`,
                "Accept": "application/json",
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                // "student": "",
                test: params.testId,
                section: params.sectionName,
            })
        })
        .then(res => res.json())
        .then(json => {
            console.log("BARK: ", json);
            return json;
        })
        .then(() => navigate(`questions/${section}`))
    }

    return (
        <>
        { !isLoading && 
        <>
            { !testAttempt.is_completed ? 
            <>
                <h2 className="center-heading">Test {params.testId}</h2>
                <div className="body-div">
                    <div className="button-container-v">
                        {
                            sections.map((section, i) => (
                                <Button onClick={(e) => handleSubmit(e, section)} disabled={inactiveSections.includes(section)} key={i} className="center">
                                    {formatSection(section)}
                                </Button>
                                // <button onClick={(e) => handleSubmit(e, section)} disabled={inactiveSections.includes(section)} key={i}>
                                //     {formatSection(section)}
                                // </button>
                            ))
                        }
                    </div>
                </div>
            </>
            :
            <div className="container-v center">
                <h2 className="center-heading">Test {params.testId} Results</h2>
                <Button onClick={() => navigate(`tests/${params.testId}/results`)} className="center">
                    View Details
                </Button>
                {/* <button onClick={() => navigate(`tests/${params.testId}/results`)} className="center">
                    View Details
                </button> */}
            </div>
            }
        </>
        }
        </>
    );
}