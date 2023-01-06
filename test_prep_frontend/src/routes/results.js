import { MathJax } from "better-react-mathjax";
import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppContext from "../AppContext";
import { formatSection } from "../helpers";

export default function Results() {
    const [sectionResults, setSectionResults] = useState();
    const { authTokens, BASE_URL } = useContext(AppContext);
    const [isLoading, setisLoading] = useState(true);
    const [currentSectionData, setCurrentSectionData] = useState();
    const [currentQuestion, setCurrentQuestion] = useState();
    const params = useParams();
    const navigate = useNavigate();
    const [scores, setScores] = useState();

    useEffect(() => {
        fetch(`${BASE_URL}student_test_attempts?test_id=${params.testId}&is_completed=True`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            setSectionResults(json[0].student_response);
            setScores(json[0].scores);
            setisLoading(false);
            return json;
        });
    }, []);

    function formatResponse(response) {
        switch (response) {
            case 0:
                return "A";
            case 1:
                return "B";
            case 2:
                return "C";
            case 3:
                return "D";
            case 4:
                return "E";
            default:
                return "Not Answered";
        }
    }

    function displayQuestion(e, question_id) {
        fetch(`${BASE_URL}testquestions/${question_id}/`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            setCurrentQuestion(json);
            return json;
        })
    }
    
    function getUserResponse(questionId) {
        return currentSectionData.responses.filter(r => r.question_id == questionId)[0].user_response;
    }

    function applyClassName(currentQuestion, answer) {
        if (Number(answer.value) == currentQuestion.correct_answer_value) return "correct";
        else if (Number(answer.value) == getUserResponse(currentQuestion.id)) return "incorrect";
    }

    function goTo(e, direction) {
        let id = currentQuestion.id;
        if (direction == "next") id++;
        else id--;
        if (id < currentSectionData.responses[0].id) id = currentSectionData.responses[currentSectionData.responses.length - 1].id;
        else if (id > currentSectionData.responses[currentSectionData.responses.length - 1].id) id = currentSectionData.responses[0].id;
        console.log("ID: ", id);
        displayQuestion(e, id);
    }

    function setClassName(response) {
        if (response.is_correct) return "correct";
        else if (!response.is_correct && !response.is_omitted) return "incorrect";
    }

    return (
        <div className="container-v">
        { !isLoading &&
            <div>
                <h1 className="center-heading">Results</h1>
                <div>
                    <h2 className="center-heading">Raw Scores</h2>
                    <div className="container-h scores">
                        <h3>Math: {scores.math}</h3>
                        <h3>Reading: {scores.reading}</h3>
                        <h3>Verbal: {scores.verbal}</h3>
                    </div>
                </div>
                <div class="section-btns">
                    { sectionResults.map(section => (
                        <button onClick={() => 
                            {setCurrentQuestion(null); setCurrentSectionData(section)}}
                        >
                            {formatSection(section.section)}
                        </button>
                    ))}
                </div>
            </div>
        }

        { !isLoading && currentQuestion && 
            <div className="test-div">
                <MathJax>
                    <div>
                        <span>{currentQuestion.number}. </span>
                        <span dangerouslySetInnerHTML={{__html: currentQuestion.prompt}}></span>
                    </div>
                    <div>
                        { currentQuestion.answers.map((answer, i) => (
                            <div className={ applyClassName(currentQuestion, answer) }>
                                <div className='answer-option-result'>
                                    <span>{formatResponse(Number(answer.value))}. </span>
                                    <span dangerouslySetInnerHTML={{__html: answer.label}}></span>
                                </div>
                                <span dangerouslySetInnerHTML={{__html: currentQuestion.explanations[i]}}></span>
                            </div>
                        ))}
                    </div>
                    <div className="container-h directional-btn-container">
                        <button onClick={(e) => goTo(e, "previous")}>Back</button>
                        <button onClick={(e) => goTo(e, "next")}>Next</button>
                    </div>
                </MathJax>
            </div>
        }

        { !isLoading && !currentQuestion && currentSectionData &&
            <div className="container-v">
                <div className="container-h scores">
                    <h3>Correct: {currentSectionData.total_correct}</h3>
                    <h3>Incorrect: {currentSectionData.total_incorrect}</h3>
                    <h3>Omitted: {currentSectionData.total_omitted}</h3>
                </div>
                <table>
                    <thead>
                        <th></th>
                        <th>Your Answer</th>
                        <th>Correct Answer</th>
                        <th></th>
                    </thead>
                    { currentSectionData.responses.map((response, i) => (
                        <tr className={ setClassName(response) }>
                            <td className="response-table-data">{ i + 1 }. </td>
                            <td className="response-table-data">{ formatResponse(response.user_response) }</td>
                            <td className="response-table-data">{ formatResponse(response.correct_answer) }</td>
                            <td className="response-table-data"><button onClick={(e) => displayQuestion(e, response.question_id)}>View Question</button></td>
                        </tr>
                    ))}
                </table>
            </div>
        }
        </div>
    );
}