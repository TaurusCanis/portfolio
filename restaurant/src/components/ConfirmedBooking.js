import {useLocation} from "react-router-dom";

export default function ConfirmedBooking() {
	const { state } = useLocation();
	const { reservationData } = state || {};	

	return (
		<div id="reservation-data">
			<h1>Your Reservation is Confirmed</h1>
			<h2>Date: {state['res-date']}</h2>
			<h2>Time: {state['res-time']}</h2>
			<h2>Guests: {state.guests}</h2>
			<h2>Occasion: {state.occasion}</h2>
		</div>
	);
}
