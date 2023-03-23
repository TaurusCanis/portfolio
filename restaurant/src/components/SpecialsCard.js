import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonBiking } from '@fortawesome/free-solid-svg-icons';

export default function SpecialsCard(props) {
	return (
		<article class="specials-card">
			<img src={props.data.img} />
			<div class="specials-item-header">
				<h3>{props.data.name}</h3>
				<h3 className="price">${props.data.price}</h3>
			</div>
			<p>{props.data.description}</p>
			<a href="">Order Delivery<FontAwesomeIcon className="svg-inline--fa fa-person-biking fa-icon"  icon={faPersonBiking} /></a>
		</article>	
	);
}
