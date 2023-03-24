import {useState,useReducer,useRef} from "react";
import {submitAPI} from "./bookingAPI";
import {useNavigate} from "react-router-dom";

export default function BookingForm(props) {
	const navigate = useNavigate();

	const [formFields, setFormFields] = useState({
		"res-date": new Date().toISOString().split("T")[0],
		"res-time": "",
		"guests": 1,
		"occasion": ""
	});

	const guestsValues = Array.from({length: 10}, (_,i) => i + 1);

	const guestsRef = useRef(null);

	const isValid = () => {
		for (const [k, v] of Object.entries(formFields)) {
			if (!v) return false;
		}
		return true;
	}

	const updateGuests = (e, delta) => {
		if (delta === -1 && formFields.guests === 1) return;
		if (delta === 1 && formFields.guests === 10) return;
		if (e.type == "click" || (e.type == "keydown" && e.key === "Enter")) {
			setFormFields({
				...formFields,
				guests: formFields.guests + delta
			});
		}
	}	

	const handleFieldChange = (e) => {
		setFormFields({
			...formFields,
			[e.target.id]: e.target.value
		});
		
		props.dispatch({type: 'change_date', date: e.target.value});
	}
	
	
	function submitForm(e) {
		e.preventDefault();
		if (submitAPI(formFields)) navigate("confirmed", { state: formFields });
		return;
	}
	
	return (
		<form data-testid="booking-form" onSubmit={submitForm}>
			<label htmlFor="res-date">Choose Date</label>
			<input onChange={handleFieldChange} type="date" id="res-date" value={formFields['res-date']} />
			<label htmlFor="res-time">Choose Time</label>
			<select id="res-time" data-testid="res-time" onChange={(e) => setFormFields({ ...formFields, 'res-time': e.target.value })}>
				{ props.availableTimes.times.map(at => (
					<option key={at} value={at}>{at}</option>
				))}
			</select>		
			<label htmlFor="guests" onClick={(e) => guestsRef.current.focus()}>Number of Guests</label>
			<div id="guests">
				<span ref={guestsRef} tabindex="0" class="guests-btn" id="guests-down" data-testid="guests-down" onClick={(e) => updateGuests(e, -1)} onKeyDown={(e) => updateGuests(e, -1)}></span>
				<span data-testid="guests-val">{formFields.guests}</span>
				<span tabindex="0" class="guests-btn" id="guests-up" data-testid="guests-up" onClick={(e) => updateGuests(e, 1)} onKeyDown={(e) => updateGuests(e, 1)}></span>
			</div>
			<label htmlFor="occasion">Occasion</label>
			<select id="occasion" onChange={(e) => setFormFields({ ...formFields, 'occasion': e.target.value })}>
				<option>Birthday</option>
				<option>Anniversay</option>
			</select>	
			<input type="submit" className="button" value="Book Now" disabled={!isValid()}/>
		</form>
	);
}
