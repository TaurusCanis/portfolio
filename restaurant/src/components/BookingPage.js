import BookingForm from "./BookingForm";
import {useState, useReducer} from "react";

export default function Booking() {

	function updateTimes() {
		return ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]
	}
	
	function initializeTimes() {
		return ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]
	}

	const [availableTimes, dispatch] = useReducer(updateTimes, initializeTimes());
	return (
		<main>
			<h1>Make a Reservation</h1>
			<BookingForm availableTimes={availableTimes} dispatch={dispatch} />
		</main>
	);
}
