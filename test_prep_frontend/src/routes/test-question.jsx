import AnswerOption from "../components/AnswerOption";
import { useState } from "react";
import QuestionText from "../components/QuestionText";
import RegularQuestion from "../components/RegularQuestion";
import ReadingQuestion from "../components/ReadingQuestion";

export default function TestQuestion({ currentIndex, question, updateUserResponse, userResponses, selectedAnswer, section, passage, isLoading }) {
    console.log("question******: ", question)
    return (
        <>
        { !isLoading &&
            <>
            { question.section == 'reading' ?
                <ReadingQuestion 
                    currentIndex={currentIndex}
                    question={question}
                    updateUserResponse={updateUserResponse}
                    userResponses={userResponses}
                    selectedAnswer={selectedAnswer}
                    section={section}
                    passage={passage}
                    isLoading={isLoading}
                />
                :
                <RegularQuestion 
                    currentIndex={currentIndex}
                    question={question}
                    updateUserResponse={updateUserResponse}
                    userResponses={userResponses}
                    selectedAnswer={selectedAnswer}
                    section={section}
                />
            }
            </>
        }
        </>
        
    );
}