

export default function SelectInput({ label, fields, handleFieldChange, options }) {
    const formattedLabel = formatLabel(label);
    const formattedFieldName = formatFieldName(formattedLabel);

    function formatLabel(label) {
    // Takes a string and returns a string with the first letter of each word set to uppercase
    // "name" => "Name"
    // "first name" => First Name

        console.log("LABEL: ", label)
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
        
        return label[0].toLowerCase() + label.slice(1).replaceAll(" ", "");
    }
    return (
        <div className="container-h form-row">
            <label>{ formattedLabel }: </label>
            <select id={label} value={[label].customer} onChange={(e) => handleFieldChange({ [label]: e.target.value})}>
                {/* default/empty option? */}
                <option>--Select--</option>
                {options.map(option => 
                    <option value={option.id} key={option.id}>{option.last_name}, {option.first_name}</option>    
                )}
            </select>
        </div>
    );
}