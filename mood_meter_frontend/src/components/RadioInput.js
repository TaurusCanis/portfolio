

export default function RadioInput({ name, id, value, label, setCurrentSelection }) {
    function handleChange(e) {
        setCurrentSelection(e.target.value);
    }

    return (
        <div className="form-row form-row-radio">
            <input onChange={handleChange} type="radio" name={name} id={id} value={value} />
            <label className="face-label" htmlFor={id}>{label}</label>
        </div>
    )
}