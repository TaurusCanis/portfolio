

export default function SearchResults(props) {
    return (
        <>
            { props.state.searchResults.length > 0 && 
            <>
                <h2>Results <span onClick={() => props.dispatch({ type: 'clearResults', field: 'searchResults' })}>{"\u24E7"}</span></h2>
                <table>
                    {
                        props.state.searchResults.map(res => (
                            <tr>
                                <td className="resultData medium" id="resultsDate">{res.date}</td>
                                <td className="resultData" id="resultsName">{res.name}</td>
                                <td className="resultData large" id="resultsVenue">{res.venue}</td>
                                <td className="resultData medium" id="resultsCity">{res.city}</td>
                                <td><a className="button primary outline" href={res.peacock_url} target="_blank">Watch on Peacock</a></td>
                            </tr> 
                        ))
                    }
                </table>
            </>
            }
        </>
    );
}