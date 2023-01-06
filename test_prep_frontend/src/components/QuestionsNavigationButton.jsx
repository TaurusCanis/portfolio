

export default function QuestionsNavigationButton({ quantity, currentIndex, updateQuestion }) {
    const questionButtons = [];

    for (let i = 0; i < quantity; i++) {
        questionButtons.push(
            <button 
                onClick={() => updateQuestion({index:i})}
                className={currentIndex == i ? "selected test-question-button" : "test-question-button" }
            >
                {i + 1} 
            </button>
        );
    }

    return (
        <div className="test-questions-buttons">
            {questionButtons}
        </div>
    );
}