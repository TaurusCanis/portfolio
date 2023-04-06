import RemoveButton from "./RemoveButton";
import {processName} from "./helpers";

export default function SearchParameterDisplay(props) {
    return (
        <section>
            { Object.keys(props.state.searchParameters).some(k => props.state.searchParameters[k].length > 0) &&
            <>
                <h2>Search Parameters <span onClick={() => props.dispatch({ type: 'clearSearchParameters', field: 'searchParameters' })}>{"\u24E7"}</span></h2>
                { 
                Object.keys(props.state.searchParameters).map(attribute => (
                    <div>
                    { props.state.searchParameters[attribute].length > 0 && 
                        <>
                        <h3>{processName(attribute)}</h3>
                        {
                            props.state.searchParameters[attribute].map(val => (
                            <div>
                                <span>{val}</span>
                                <span onClick={() => props.dispatch({ type: 'removeSearchParameter', field: attribute, value: val })}>{"\u24E7"}</span>
                            </div>
                        ))}
                        </>
                    }
                    </div>
                ))
                }
            </>
            }
        </section>
    );
}