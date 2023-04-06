

export default function AddButton(props){
    const handleSubmit = (e) => {
        e.preventDefault();
        return props.inputRef.dispatchEvent(new KeyboardEvent('keydown',{
            key:'Enter', 
            bubbles: true, 
            cancelable: true,
        }));
    }

    return (
        <input
            className="button secondary inputIsDisplayed"
            type="submit"
            value={`Add ${"\uFF0B"}`} 
            onClick={handleSubmit}
        />
    );
}