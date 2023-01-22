import QuestionsNavigationButton from "../components/QuestionsNavigationButton";
import TestQuestion from "./test-question";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import testData from "../practice_tests/SSAT_Practice_Test_1_Official.json";
import { useEffect } from "react";
import { MathJax } from "better-react-mathjax";
import { useContext } from "react";
import AppContext from "../AppContext";
import Timer from "../components/Timer";
import Button from "../components/Button";
import DirectionalButton from "../components/DirectionalButton";

export default function TestContainer() {

    const params = useParams();
    const navigate = useNavigate();
    console.log("params: ", params)
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userResponses, setUserResponses] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(-1);
    const [readingPassages, setReadingPassages] = useState([]);
    const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
    const [attemptIsInProgress, setAttemptIsInProgress] = useState(false);
    const [attemptData, setAttemptData] = useState();
    const { BASE_URL, authTokens } = useContext(AppContext);
    const [testAttempt, setTestAttempt] = useState();
    const [timeLimit, setTimeLimit] = useState();
    const [timeHasExpired, setTimeHasExpired] = useState(false);

    let readingPassagesLoaded = params.sectionName != 'reading';
    
    let questionsLoaded = false;

    useEffect(() => {
        fetch(`${BASE_URL}testquestions?test_id=${params.testId}&section=${params.sectionName}`, {
            method: "GET"
        })
        .then(res => {
            console.log("RES: ", res);
            return res.json();
        })
        .then(json => {
            console.log("json---->>>>: ", json);
            setQuestions(json.question_data);
            setTimeLimit(json.time_limit);
            return json.question_data.length;
        })
        .then(length => {
            console.log("LENGTH: ", length);
            setUserResponses(Array(length).fill(-1));
            questionsLoaded = true;
            return;
        })
        .then(() => {
            console.log('readingPassagesLoaded: ', readingPassagesLoaded);
            console.log('questionsLoaded: ', questionsLoaded);
            console.log('questionsLoaded && readingPassagesLoaded: ', questionsLoaded && readingPassagesLoaded);
            setIsLoading(!(questionsLoaded && readingPassagesLoaded));
        });
    }, []);

    useEffect(() => {
        if (params.sectionName == "reading") {
            fetch(`${BASE_URL}readingpassages?test_id=${params.testId}`, {
                method: "GET"
            })
            .then(res => {
                return res.json();
            })
            .then(json=> {
                console.log("PASSAGES FOR TEST: ", json)
                setReadingPassages(json);
                readingPassagesLoaded = true;
                return json;
            })
            .then(() => {
                console.log('readingPassagesLoaded: ', readingPassagesLoaded);
                console.log('questionsLoaded: ', questionsLoaded);
                console.log('questionsLoaded && readingPassagesLoaded: ', questionsLoaded && readingPassagesLoaded);
                setIsLoading(!(questionsLoaded && readingPassagesLoaded));
            });
        }
    }, []);

    // useEffect(() => {
    //     fetch(`http://127.0.0.1:8000/test-prep-api/scoretestsection?test_id=${params.testId}`, {
    //         method: "GET",
    //     })
    //     .then(res => res.json())
    //     .then(json => {
    //         console.log("JSON: ", json);
    //         setAttemptData(json);
    //         setAttemptIsInProgress(json.length > 0);
    //         return json;
    //     })
    // }, []);

    useEffect(() => {
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
            setTestAttempt(json);
            return json;
        })
    }, []);

    function updateUserResponse(event) {
        const userResponsesCopy = [...userResponses];
        const selection = Number(event.target.value)
        if (selectedAnswer == selection) {
            userResponsesCopy[event.target.name] = -1;
            setSelectedAnswer(-1);
        } else {
            userResponsesCopy[event.target.name] = selection;
            setSelectedAnswer(selection);
        }
        setUserResponses(userResponsesCopy);
    }

    function updateQuestion({ direction, index }) {
        console.log("INDEX: ", index)
        let nextIndex = index;
        if (nextIndex != null) {
            setCurrentIndex(nextIndex);
            setSelectedAnswer(userResponses[nextIndex]);
        }
        else {
            
            if (direction == "next") {
                if (currentIndex == questions.length - 1) nextIndex = 0;
                else nextIndex = currentIndex + 1;
            }
            else {
                if (currentIndex == 0) nextIndex = questions.length - 1;
                else nextIndex = currentIndex - 1;
            }
            setCurrentIndex(nextIndex);
            setSelectedAnswer(userResponses[nextIndex]);
        }
        if (params.sectionName == "reading") updateReadingPassage(nextIndex);
    }

    function updateReadingPassage(nextIndex) {
        let passageIndex = (questions[nextIndex].reading_passage % 8) - 1;
        passageIndex = passageIndex >= 0 ? passageIndex : 7;
        setCurrentPassageIndex(passageIndex);
    }

    function submitTest() {
        let method = "POST";
        let url = `${BASE_URL}scoretestsection/?test_id=${params.testId}&section=${params.sectionName}`;
        if (attemptIsInProgress) {
            method = "PATCH";
            url = `${BASE_URL}scoretestsection/${attemptData[0].id}/`
        }
        console.log("REQUEST URL: ", url)
        console.log("userResponses: ", userResponses)
        fetch(url, {
            method: method,
            body: JSON.stringify({
                student_test_attempt: testAttempt.id,
                section: params.sectionName,
                user_responses: userResponses,
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        })
        .then(async res => { 
            let json = await res.json();
            console.log("JSSSSON: ", json);
            if (res.ok) {
                if (!json.is_completed) {
                    navigate(`/tests/${params.testId}`);
                }
                else {
                    navigate(`/tests/${params.testId}/results`);
                }
            }
        })
        .catch(err => console.log("error: ", err));
    }

    return (
        <div className="container-h width-inherit test-container">
            {/* <button onClick={() => updateQuestion({direction:"last"})}>
                {"<"}
            </button> */}
            <DirectionalButton onClick={() => updateQuestion({direction:"last"})}>
                {"<"}
            </DirectionalButton>
            <div className="test-div">
                { !isLoading &&
                        <>
                        <div className="container-h">
                            <QuestionsNavigationButton 
                                quantity={questions.length} 
                                currentIndex={currentIndex} 
                                updateQuestion={updateQuestion} 
                            />
                            <Timer timeLimit={timeLimit} setTimeHasExpired={setTimeHasExpired} submitTest={submitTest}/>
                        </div>
                        
                        <MathJax dynamic={true}>
                        <TestQuestion 
                            currentIndex={currentIndex} 
                            question={questions[currentIndex]} 
                            userResponses={userResponses} 
                            updateUserResponse={updateUserResponse} 
                            selectedAnswer={selectedAnswer}
                            passage={readingPassages[currentPassageIndex]}
                            isLoading={isLoading}
                            section={params.sectionName}
                        />
                        </MathJax>
                        <Button onClick={submitTest} className="center">
                                Submit  
                            </Button>
                        {/* <div className="container-h directional-btn-container">
                            <button onClick={() => updateQuestion({direction:"last"})}>
                                Previous
                            </button>
                            
                            <button onClick={submitTest}>
                                Submit
                            </button>
                            <button onClick={() => updateQuestion({direction:"next"})}>
                                Next
                            </button>
                        </div> */}
                        </>
                }
            </div>
            <DirectionalButton onClick={() => updateQuestion({direction:"next"})}>
                {">"}
            </DirectionalButton>
            {/* <button onClick={() => updateQuestion({direction:"next"})}>
                >
            </button> */}
        </div>
    );
}