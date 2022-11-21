import RadioSelectInput from "./RadioSelectInput";

export default function RadioSelectGroup({ group, keyName, fields, handleFieldChange, options }) {
    return (
        <div className={group}>
            <h4>{keyName[0].toUpperCase() + keyName.slice(1)}:</h4>
            <RadioSelectInput fields={fields} handleFieldChange={handleFieldChange} options={options} keyName={keyName} />
        </div>
    );
}