import { getData } from "../util/helpers";
import { useState } from "react";

export default function DatePicker({setAppointments, setIsLoading, authTokens}) {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    function handleSubmit(e) {
        alert("Handle Submit")
        e.preventDefault();
        getData((res) => {
                setAppointments(res);
                setIsLoading(false);
            }, 
            "appointments", 
            authTokens,
            {
                "start_date": startDate,
                "end_date": endDate,
            })
    }

    // function resetFilter() {
    //     setStartDate(null);
    //     setEndDate(null);
    // }

    return (
        <div className="date-picker table-row">
            <form onSubmit={(e) => handleSubmit(e)}>
                <label>Start Date: </label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}></input>
                <label>End Date: </label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                <input type="submit" value="Update"></input>
            </form>
            {/* <button onClick={resetFilter}>Clear</button> */}
        </div>
    );
}