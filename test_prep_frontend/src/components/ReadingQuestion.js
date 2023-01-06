import QuestionText from "./QuestionText";
import AnswerOption from "./AnswerOption";
import { useEffect } from "react";

export default function ReadingQuestion({ currentIndex, question, updateUserResponse, userResponses, selectedAnswer, section, passage, isLoading }) {    
    return (
        <>
        { !isLoading && 
            <div className="container-h">  
                
                <div className="container-v reading-container">
                    <div className="reading-question-text">
                        <span>{currentIndex + 1}.</span>
                        <QuestionText text={question.prompt} section={question.section}/>
                    </div>
                    
                    <div className="container-h reading-answer-options-container">
                        <div className="container-v answer-options">
                            {
                                question.answers.map((option, i) => {
                                    const checked = userResponses[currentIndex] == i ? true : false; 
                                    return (
                                        <AnswerOption 
                                        option={option.label} 
                                        i={i} 
                                        selectedAnswer={selectedAnswer}
                                        updateUserResponse={updateUserResponse}
                                        // userResponses={userResponses}
                                        checked={checked}
                                        currentIndex={currentIndex}
                                    />
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="reading-passage" dangerouslySetInnerHTML={{__html: passage.text}}>
                </div>
            </div>
        }
        </>
    )
}