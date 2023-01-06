
export default function TextInput({ label, fields, handleFieldChange, type }) {

    const formattedLabel = formatLabel(label);
    // const formattedFieldName = formatFieldName(formattedLabel);
    const formattedFieldName = formatFieldName(label);

    function formatLabel(label) {
    // Takes a string and returns a string with the first letter of each word set to uppercase
    // "name" => "Name"
    // "first name" => First Name

        label = label[0].toUpperCase() + label.slice(1);

        if (label.indexOf(" ") > 0) {
            let index = 0;
            while (index < label.length) {
                if (label[index] == " ") {
                    label = label.slice(0,index + 1) + label[index + 1].toUpperCase() + label.slice(index + 2);
                    index++;
                }
                if (label.slice(index).indexOf(" ") == 0) break;   
                index++;       
            }
        }
        return label;
    }

    function formatFieldName(label) {
        // Take a string and returns a string with whitespace removed and first letter lowercase
        // First Name => firstName
        
        return label[0].toLowerCase() + label.slice(1).replaceAll(" ", "_");
    }

    return (
        <div className="container-h form-row">
            <label>{ formattedLabel }: </label>
            <input type={type} id={label} value={fields[formattedFieldName]} onChange={(e) => handleFieldChange({ [formattedFieldName]: e.target.value})} />
        </div>
    )
}