import { processName } from "./helpers";
import AddButton from "./AddButton";
import { useRef } from "react";

export default function SearchFormInputContainer(props) {
	const displayName = processName(props.name);
	const inputRef = useRef();

    return (
	<div className={`searchInput ${props.searchParametersDisplay ? "show" : "hide"}`}>
		{
		!props.isLoading && props.searchOptions != null && 
		<input 
			onChange={(e) => props.dispatch({
				type: 'updateFormField',
				field: e.target.name,
				value: e.target.value,
			})}
			onKeyDown={(e) => {
				if (e.key === 'Enter') props.dispatch({ type: 'addSearchParameter', e: e });
			}}
			type="text" 
			list={props.searchOptions != null && 
				props.name in props.searchOptions ? props.name : ""}
			value={props.value} 
			// id={props.name} // for some reason, list will not render if id is included
			name={props.name} 
			placeholder={displayName} 
			ref={inputRef}
		/>
		}
		<AddButton 
			dispatch={props.dispatch} 
			value={props.value}
			inputRef={inputRef.current}
		/>
	</div>
    );
}
