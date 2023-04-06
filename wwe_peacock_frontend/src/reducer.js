import { dummyData } from "./dummyData/wwe_test_data";

const addValue = (e, state) => {
    const attributeName = e.target.name.includes("Date") ? "date" : e.target.name;
    const copy = {...state}
    copy[attributeName].push(e.target.value)
    return copy
}

const clearFormInput = (e, state) => {
    return {
        ...state,
        [e.target.name]: "",
    }
};

const removeValue = (state, field, value) => {
    const copy = {...state};
    copy[field] = copy[field].filter(item => item !== value);
    return copy;
}

const reset = (params) => {
	return Object.keys(params).reduce((obj, field) => {
		obj[field] = [];
		return obj;
	}, {})
}

const searchReducer = (state, action) => {
	switch(action.type) {
	    case 'updateFormField':
			return {
				...state,
				formFields: {
					...state.formFields,
					[action.field]: action.value,
				}
			}

	    case 'updateInputsDisplay':
            console.log(action.field);
			return {
				...state,
				searchInputsDisplay: {
					...state.searchInputsDisplay,
					[action.field]: !state.searchInputsDisplay[action.field],
				}
			}

	    case 'addSearchParameter': 
            console.log("E: ", action.e);
			return {
                ...state,
                searchParameters: addValue(action.e, state.searchParameters),
                formFields: clearFormInput(action.e, state.formFields),   
            }

		case 'removeSearchParameter':
			const updatedValue = removeValue(state.searchParameters, action.field, action.value);
			return {
				...state,
				searchParameters: updatedValue,
			}

        case 'updateSearchResults':
            return {
                ...state,
                searchResults: action.value
            }   
			
		case 'clearResults':
			return {
				...state,
				searchResults: []
			}
		case 'clearSearchParameters':
			return {
				...state,
				searchParameters: reset(state.searchParameters)
			}

		default:
			return state
	}
    };

    export { searchReducer };