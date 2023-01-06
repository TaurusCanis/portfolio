import { useEffect, useState } from "react";

export default function Timer({ timeLimit }) {
    let d1;
    let d2;
    let difference;
    const [time, setTime] = useState();
    const [endTime, setEndTime] = useState();

    useEffect(() => {
        // d1 = new Date();
        // d2 = new Date(d1.getTime() + timeLimit*60000);
        // difference = d2.getMinutes() - d1.getMinutes();
        // setEndTime(d2.getMinutes());
        // setTime(difference > 0 ? difference : 60 + difference);
        startTimer(timeLimit * 60, setTime)
    }, []);

    // setInterval(() => {
    //     d1 = new Date();
    //     difference = endTime - d1.getMinutes();
    //     setTime(difference > 0 ? difference : 60 + difference);
    // }, 250);

    function startTimer(duration, setTime) {
        var start = Date.now(),
            diff,
            minutes,
            seconds;
        function timer() {
            // get the number of seconds that have elapsed since 
            // startTimer() was called
            diff = duration - (((Date.now() - start) / 1000) | 0);
    
            // does the same job as parseInt truncates the float
            minutes = (diff / 60) | 0;
            seconds = (diff % 60) | 0;
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
    
            setTime(minutes + ":" + seconds); 
    
            if (diff <= 0) {
                // add one second so that the count down starts at the full duration
                // example 05:00 not 04:59
                start = Date.now() + 1000;
            }
        };
        // we don't want to wait a full second before the timer starts
        timer();
        setInterval(timer, 250);
    }

    return (
        <div className="timer center-heading">
            {time}
        </div>
    );
}