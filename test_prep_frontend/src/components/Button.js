

export default function Button({ children, onClick, className, disabled=false }) {
    return (
        <button className={`button-primary ${className}`} onClick={onClick} disabled={disabled}>
            { children }
        </button>
    );
}