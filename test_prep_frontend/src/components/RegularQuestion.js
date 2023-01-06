import QuestionText from "./QuestionText";
import AnswerOption from "./AnswerOption";

export default function RegularQuestion({ currentIndex, question, updateUserResponse, userResponses, selectedAnswer, section }) {
    return (
        <div className="container-h">  
            <div className="question-text">
                <span className="question-number">{currentIndex + 1}.</span>
                <QuestionText text={question.prompt} section={question.section}/>
            </div>
            <div className="container-h answer-options-container">
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
    )
}