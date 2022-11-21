

export default function PanelRow({ label, value }) {
    return (
        <div className="container-h panel-row">
            <div>{label}: </div>
            <div>{value}</div>
        </div>
    );
}