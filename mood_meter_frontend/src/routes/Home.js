import RadioInput from "../components/RadioInput";
import { useState, useEffect } from "react";
import { drawChart, initChart } from "../charts/BasicD3";
import BarChart from "../charts/D3BarChartTest";

export default function Home() {
    const [moodRatings, setMoodRatings] = useState([
        {
            "date": "2022-12-01",
            "rating": "1"
        },
        {
            "date": "2022-12-02",
            "rating": "2"
        },
        {
            "date": "2022-12-03",
            "rating": "1"
        },
        {
            "date": "2022-12-04",
            "rating": 0,
        },
        {
            "date": "2022-12-04",
            "rating": "3"
        },
    ]);

    const [currentSelection, setCurrentSelection] = useState();
    const [displayMoodForm, setDisplayMoodForm] = useState(true);

    function handleSubmit(e) {
        e.preventDefault();
        let today = new Date();
        today = today.toISOString();

        setMoodRatings([...moodRatings, {
            "date": today,
            "rating": currentSelection,
        }]);
        setDisplayMoodForm(false);
        setCurrentSelection();
    }

    function toggleDisplay() {
        setDisplayMoodForm(!displayMoodForm);
    }

    // const [data, setData] = useState([]);

    // useEffect(() => {
    //     changeData();
    // }, []);

    // const changeData = () => {
    //     setData(moodRatings);
    // }

    return (
        <>
            { displayMoodForm ?
                <>
                    <button onClick={toggleDisplay}>Show Data</button>
                    <h1 className="heading-center">Log Your Current Mood</h1>
                    <form onSubmit={handleSubmit} className="mood-form">
                        <div className="mood-form-options">
                            <RadioInput name="mood" id="mood-1" value="1" label="&#128577;" setCurrentSelection={setCurrentSelection} />
                            <RadioInput name="mood" id="mood-2" value="2" label="&#128528;" setCurrentSelection={setCurrentSelection} />
                            <RadioInput name="mood" id="mood-3" value="3" label="&#128512;" setCurrentSelection={setCurrentSelection} />
                        </div>
                        <div className="form-row form-row-btn">
                            <input disabled={!currentSelection} className="btn" type="submit" value="Save" />
                        </div>
                    </form>
                </>
                :
                <>
                    <button onClick={toggleDisplay}>Add Mood Rating</button>
                    <h1>View Data</h1>
                    {/* <button onClick={changeData}>Change Data</button> */}
                    <BarChart width={600} height={400} data={moodRatings} />
                </>
            }
        </>
        
    );
}