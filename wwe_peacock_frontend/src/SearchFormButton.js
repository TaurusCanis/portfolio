import { processName } from "./helpers";

export default function SearchFormButton(props) {
    // const fName = props.name.includes("-") ? processName(props.name) : props.name;
    // const displayName = props.name.includes("-") ? processName(props.name) : props.name;
    // const [fieldName, displayName] = processName(props.name);
    const displayName = processName(props.name);

    const toggleInputDisplay = (e) => {
        e.preventDefault();
        // props.setSearchParametersDisplay({ ...props.searchParametersDisplay, [props.name]: true });
        props.dispatch({
            type: 'updateInputsDisplay',
            field: props.name,
            value: true,
        });
    }

    return(
	    <button 
            className={`toggleSearchParametersBtn secondary ${props.state.searchInputsDisplay[props.name] ? "inputIsDisplayed" : "inputIsHidden"}`}
            onClick={toggleInputDisplay}
        >
            {displayName}
            <span className="toggleInputDisplay">{"\uFF0B"}</span>
        </button>
    );
}
