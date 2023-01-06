
export default function AnswerOption({ option, i, checked, selectedAnswer, currentIndex, updateUserResponse }) {
    function getLetter(i) {
        return String.fromCharCode(65 + i);
    }

    return (
        <div className="answer-option">
            <input type="radio" checked={selectedAnswer === i} id={`answer-option-${i}`} value={i} name={currentIndex} onClick={updateUserResponse}/>
            <label className="answer-option-label" htmlFor={`answer-option-${i}`}>{getLetter(i)}</label>
            <span className="answer-option-text" dangerouslySetInnerHTML={{__html: option}}></span>
        </div>
    )
}

