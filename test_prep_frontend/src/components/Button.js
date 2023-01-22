

export default function Button({ children, onClick, className }) {
    return (
        <button className={`button-primary ${className}`} onClick={onClick}>
            { children }
        </button>
    );
}