import Testimonial from "./Testimonial";

export default function Testimonials() {
	const testimonials = [
		{
			"rating": "5",
			"name": "Barbara Bean",
			"review": "Such a delightful little restaurant!"
		},
		{
			"rating": "5",
			"name": "Bob Bowlding",
			"review": "Excellent! Among the best restaurants in all of Chicago"
		},
		{
			"rating": "5",
			"name": "Charles Hughes",
			"review": "I haven't had a meal this good in ages! Try the Rigatoni!"
		},
		{
			"rating": "5",
			"name": "Lauren Steen",
			"review": "You can never go wrong ordering from the Little Lemon."
		}
	]
	return (
		<section id="testimonials">
			<h2>Testimonials</h2>			
			<div class="testimonials-container">
				{ testimonials.length > 0 && testimonials.map(t => (
							<Testimonial data={t} />
						)
					)
				}
			</div>
		</section>
	);
}
