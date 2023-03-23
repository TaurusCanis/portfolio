import './App.css';
import './styles.css';
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import BookingPage from "./components/BookingPage";
import ConfirmedBooking from "./components/ConfirmedBooking";
import Footer from "./components/Footer";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import {useState} from "react";

function App() {
	const [displayMobileNav, setDisplayMobileNav] = useState(false);	

	return (
		<BrowserRouter basename='/restaurant'>
		<div className="App">
			<Header displayMobileNav={displayMobileNav} setDisplayMobileNav={setDisplayMobileNav} />
			<Navbar displayMobileNav={displayMobileNav} />
			<Routes>
				<Route path="/" element={<Homepage />}></Route>
				<Route path="/booking" element={<BookingPage />}></Route>
				<Route path="/booking/confirmed" element={<ConfirmedBooking />}></Route>
			</Routes>
			<Footer />
   	 	</div>
    		</BrowserRouter>
  	);
}

export default App;
