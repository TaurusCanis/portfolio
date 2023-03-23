import { useNavigate } from "react-router-dom";

export default function ButtonLink(props) {
	const navigate = useNavigate();
	
	return (
		<button onClick={() => navigate(props.url)}>{props.children}</button>
	);
}
