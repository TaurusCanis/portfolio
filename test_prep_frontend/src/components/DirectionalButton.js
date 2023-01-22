

export default function DirectionalButton({ children, onClick }) {
    return (
        <button className="directional-btn" onClick={onClick}>
            {children}
        </button>
    )
}