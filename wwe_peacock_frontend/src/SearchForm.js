import { useState } from "react";
import SearchFormButton from "./SearchFormButton";
import SearchFormInputContainer from "./SearchFormInputContainer"; 
import { useContext } from "react";
import { AppContext } from "./AppContext";

export default function SearchForm(props, children) {
	const { BASE_URL } = useContext(AppContext);
	const [dateType, setDateType] = useState("on");  
	const handleDateChange = (e) => {
		props.dispatch({
			type: 'updateFormField',
			field: e.target.name,
			value: e.target.value,
		});
		props.dispatch({ type: 'addSearchParameter', e: e })
	}

	const buildUrl = (params) => {
		const urlParams = new URLSearchParams();
		Object.entries(params)
				.filter(([k, v]) => v.length > 0)
				.forEach(([k, v]) => 
					v.forEach(element => urlParams.append(k, element))
				);
		return "?" + urlParams;
	}
	
	const fetchResults = (e) => {
		e.preventDefault();

		// This code was used for testing without accessing the DB
		// const results = dummyData.filter(event => {
		//     console.log(event.City)
		//     return params.city.some(str => {
		//         console.log("STR: ", str);
		//         return event.City.includes(str)
		//     });
		// });
		// console.log("results: ", results);
		// return results;

		const url = `${BASE_URL}list/${buildUrl(props.state.searchParameters)}`;
	
		fetch(url)
				.then(res => res.json())
				.then(data => {
					props.dispatch({ type: 'updateSearchResults', value: data})
					console.log("DATA: ", data);
				})
				.catch(err => console.log("EER: ", err));
		return;
	}
 
    return (
		<form>
			<div id="searchParametersBtnContainer">
				{
					/* filter function needs to be removed when date is implemented */
					props.searchFields.filter(field => field !== 'date').map(key => (
						<SearchFormButton
							key={key}
							name={key}
							searchParametersDisplay={props.state.searchInputsDisplay['date']} 
							dispatch={props.dispatch} 
							state={props.state}
						/>
					))
				}
			</div>
			<div id="searchFormsContainer">
				{/*
					Date is a little tricky to implement. Will hold off for now.
					<DateInput 
						state={state} 
						dispatch={dispatch}
						dateType={dateType} 
						setDateType={setDateType} 
						handleDateChange={handleDateChange}
					/>
				*/}
				{
					props.searchFields.filter(x => x !== 'date').map(key => (
						
						<SearchFormInputContainer 
							key={key}
							name={key}
							value={props.state.formFields[key]} 
							dispatch={props.dispatch}
							state={props.state}
							searchParametersDisplay={props.state.searchInputsDisplay[key]}
							searchOptions={props.searchOptions} 
							isLoading={props.isLoading}
						/>
					))
				}
			</div>
			<button className="primary" onClick={fetchResults}>
				Search
			</button>
		</form>
    );
}
