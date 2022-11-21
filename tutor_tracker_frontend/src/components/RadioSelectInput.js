

export default function RadioSelectInput({ fields, handleFieldChange, options, keyName}) {
    return (
        <>
        { options.map((option, i) => (
            <div className="radio">
                <label>
                    <input type="radio" value={option[1]} 
                                checked={fields[keyName] === option[1]} 
                                onChange={(e) => handleFieldChange({ [keyName]: e.target.value})} />
                    {option[0]} 
                </label>
            </div>
        ))}
        </>
    );
}