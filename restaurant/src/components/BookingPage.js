import BookingForm from "./BookingForm";
import {useState, useReducer} from "react";
import {fetchAPI} from "./bookingAPI";

export function updateTimes(state, action) {
	switch(action.type) {
		case 'change_date': {
			const newDate = new Date(action.date + "T17:00:00Z");
			const times = fetchAPI(newDate);
		
			return {
				date: newDate,
				times: times
			};
		}
	}
	throw Error('Unknown action: ' + action.type);
}
        
export function initializeTimes() {
	const today = new Date();
        return { date: today, times: fetchAPI(today) };
}

export default function Booking() {

	const [availableTimes, dispatch] = useReducer(updateTimes, initializeTimes());
	
	return (
		<main>
			<h1>Make a Reservation</h1>
			<BookingForm availableTimes={availableTimes} dispatch={dispatch} />
		</main>
	);
}
