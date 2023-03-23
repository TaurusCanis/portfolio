import LittleLemonHeader from "../assets/images/LittleLemonHeader_small";

export default function Header(props) {
	const toggleNavClass = () => {
		props.setDisplayMobileNav(!props.displayMobileNav);
	}

	return (
		<header>
			<img src={LittleLemonHeader} />
			<div onClick={toggleNavClass} id="hamburger-icon"><span id="hamburger-icon-bar" className={`hamburger-${props.displayMobileNav ? "show" : "hide" }`}></span></div>
		</header>
	);
}
