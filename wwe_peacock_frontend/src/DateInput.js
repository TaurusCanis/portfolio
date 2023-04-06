
export default function DateInput(props) {
    return (
        <div className={props.state.searchInputsDisplay['date'] ? "show" : "hide"} id="formBlockDate">
            <div>
                <span onClick={() => props.setDateType("on")}>On</span><span onClick={() => props.setDateType("between")}>Between</span>
            </div>
            <input onChange={props.handleDateChange} type="date" id="startDate" name="startDate" />
            { 
                props.dateType === 'between' &&
                    <>
                        <span>and</span>
                        <input onChange={props.handleDateChange} type="date" id="endDate" name="endDate" />
                    </>
            }
            <span className="closeInputDisplay" onClick={() => props.dispatch({ type: 'updateInputsDisplay', field: "date", value: false })}>X</span>
        </div>
    );
}