

export default function SearchOptionsDataLists(props) {
    return (
        <div id="search-options-data-lists">
        {
            props.searchOptions != null &&
            Object.entries(props.searchOptions).map(([key, val]) => {
                return (
                    <datalist id={key}>
                        {
                            val.map(opt => {
                                return <option>{opt.name}</option>
                            })
                        }
                    </datalist>
                )
            })
        }
        </div>
    );
}