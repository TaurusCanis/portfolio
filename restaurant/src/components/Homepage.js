import greek_salad from "../assets/images/GreekSalad_Small";
import bruschetta from "../assets/images/Bruchetta_small";
import rigatoni from "../assets/images/Rigatoni_small";
import SpecialsCard from "./SpecialsCard";
import SmallPlates from "../assets/images/SmallPlates_small";
import Testimonials from "./Testimonials";
import ButtonLink from "./ButtonLink";

export default function Homepage() {
	const specials = [
		{
			"name": "Greek Salad",
			"img": greek_salad,
			"price": "12.99",
			"description": "Famous Greek salad of crispy lettuce, peppers, olives, and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons."
		},
		{
			"name": "Bruschetta",
			"img": bruschetta,
			"price": "9.99",
			"description": "Our bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil."
		},
		{
			"name": "Rigatoni",
			"img": rigatoni,
			"price": "15.00",
			"description": "Our pasta is made fresh in-house daily and our pasta sauce is made from locally sourced tomatoes."
		}
	]

	return (
		<main>
			<section id="hero">
				<div id="hero-left">
					<h1>Little Lemon</h1>
					<h2>Chicago</h2>
					<p>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</p>
					<ButtonLink url="/booking">Reserve a Table</ButtonLink>
				</div>
				<img src={SmallPlates} />
			</section>
			<section id="specials">
				<div id="specials-header">
					<h2>Specials</h2>
					<button>Online Menu</button>
				</div>
				<div id="specials-cards-container">
					<SpecialsCard data={specials[0]} />
					<SpecialsCard data={specials[1]} />
					<SpecialsCard data={specials[2]} />
				</div>
			</section>
			<Testimonials />
			<section id="info-section">	
				<div id="info-left">
					<h1>Little Lemon</h1>
					<h2>Chicago</h2>
					<p>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</p>
				</div>
				<img src={bruschetta} />
			</section>
		</main>
	);
}
