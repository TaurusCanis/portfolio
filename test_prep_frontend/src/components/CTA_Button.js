import { Link } from "react-router-dom";

export default function CTA_Button({ text, cls }) {
    return (
        <Link to="/signup" className={cls}>{ text }</Link>
    );
}