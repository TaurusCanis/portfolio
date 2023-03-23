
export default function Testimonial(props) {
	return (
		<article>
			<h3>{props.data.rating} Stars</h3>
			<p>{props.data.review}</p>							<h3>- {props.data.name}</h3>
		</article>	
	);
}
