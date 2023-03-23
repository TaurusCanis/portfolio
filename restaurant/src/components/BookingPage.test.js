import { fireEvent, render, screen } from "@testing-library/react";
import Booking from "./BookingPage";
import { initializeTimes, updateTimes } from "./BookingForm";
import {BrowserRouter} from "react-router-dom";

test('initializeTimes function', () => {
	expect(initializeTimes().times.length).toBeGreaterThanOrEqual(0);
});

test('updateTimes function', () => {
	expect(updateTimes({date: "2023-03-15", times: []}, {type: 'change_date', date: "2023-03-17"}).times.length).toBeGreaterThanOrEqual(0);
});

test('submit button is disabled untl form is complete', () => {
	render(<BrowserRouter><Booking /></BrowserRouter>)
	const submitFormBtn = screen.getByText('Book Now');
	expect(submitFormBtn).toBeDisabled();
	
	const date = screen.getByLabelText('Choose Date');
	fireEvent.change(date, {target: {value: '2023-03-17'}});
	expect(submitFormBtn).toBeDisabled();

	const time = screen.getByLabelText('Choose Time');
	fireEvent.change(time, {target: {value: '22:00'}});
	expect(submitFormBtn).toBeDisabled();
	
	const occasion = screen.getByLabelText('Occasion');
	fireEvent.change(occasion, {target: {value: 'Birthday'}});
	expect(submitFormBtn).not.toBeDisabled();
})

test('guests can be no less than 1 and no greater than 10', () => {
	render(<BrowserRouter><Booking /></BrowserRouter>);
	const decBtn = screen.getByTestId('guests-down');
	const incBtn = screen.getByTestId('guests-up');
	const guests = screen.getByTestId('guests-val');

	fireEvent.click(decBtn);
	expect(guests.innerHTML).toEqual("1");

	for (let i = 0; i < 10; i++) {
		fireEvent.click(incBtn);
	}

	expect(guests.innerHTML).toEqual("10");
});
