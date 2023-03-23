import { Link } from "react-router-dom";

export default function Navbar(props) {
	return (
		<nav className={props.displayMobileNav ? "show" : "hide"}>
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/#info-section">About</a></li>
				<li><a href="/#specials">Menu</a></li>
				<li><Link to="/booking">Reservations</Link></li>
				<li><a href="/#specials">Order Online</a></li>
				<li><a href="/">Login</a></li>
			</ul>
		</nav>
	);
}
