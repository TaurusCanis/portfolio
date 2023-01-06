export default function SubmitButton({ validateForm, fields }) {
    return (
        <div className="form-row">
            <input className="submit-button" type="submit" disabled={!validateForm(fields)}/>
        </div>
    );
}