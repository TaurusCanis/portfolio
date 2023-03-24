import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

export default function Navbar(props) {

	return (
		<nav className={props.displayMobileNav ? "show" : "hide"}>
			<ul>
				<li><Link to="/">Home</Link></li>
				<li><HashLink to="/#info-section">About</HashLink></li>
				<li><HashLink to="/#specials">Menu</HashLink></li>
				<li><Link to="/booking">Reservations</Link></li>
				<li><HashLink to="/#specials">Order Online</HashLink></li>
				<li><Link to="/">Login</Link></li>
			</ul>
		</nav>
	);
}
