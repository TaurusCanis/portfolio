import { useState, useEffect } from "react";

export default function AppointmentNotes() {
    const [appointmentNotes, setAppointmentNotes] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/tracker/appointment_notes/', {
          method: "GET",
        })
          .then((response) => response.json())
          .then(res => {
            console.log(res)
            setAppointmentNotes([...appointmentNotes, ...res])
          })
          .then(() => console.log("appointmentNotes: ", appointmentNotes))
      }
    , [])


    return (
      <div>
        <h2>AppointmentNotes</h2>
        <>
        {appointmentNotes.map((appointmentNote, i) =>
          <div key={i}>{appointmentNote.id} - {i}</div>  
        )}
        </>
      
      </div>
    );
  }