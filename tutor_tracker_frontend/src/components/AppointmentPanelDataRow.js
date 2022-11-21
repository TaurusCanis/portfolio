
export default function AppointmentPanelDataRow({ label, data }) {
    return (
        <div className="container-h dashboard-panel-content-row">
            <span className="dashboard-panel-content-row-label">
                { label } 
            </span>
            <span className="dashboard-panel-content-row-value">
                { data && data }
            </span>  
        </div>
    )
}