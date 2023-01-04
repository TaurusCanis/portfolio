import { useState, useEffect } from "react";
import { getData } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useFormFields } from "../util/hooks";
import { useNavigate, useParams } from "react-router-dom";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/FormTextInput";
import SubmitButton from "../components/SubmitButton";
import { validateForm } from "../util/helpers";

export default function CreateInvoice() {
    let params = useParams();
    let navigate = useNavigate();

    const [customers, setCustomers] = useState();
    const [customerHasChanged, setCustomerHasChanged] = useState(false);
    const [appointments, setAppointments] = useState();
    const [selectedAppointment, setSelectedAppointment] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
    const { authTokens, BASE_URL } = useContext(AuthContext);
    // const [fields, handleFieldChange] = useFormFields({ 
    //     appointment: "", 
    //     amount: 0,
    //     // startDate: "",
    //     // endDate: "",
    //  });

    //  const [invoiceAmount, setInvoiceAmount] = useState(0);

    // try {
    //     useEffect(() => getData((res) => {
    //         setCustomers(res);
    //         setIsLoading(false);
    //     }, `customers/`, authTokens), []);
    // } catch (e) {
    //     console.log("ERROR: " + e);
    // }

    // try {
    //     useEffect(() => {
    //         if (customerHasChanged) {
    //             getData((res) => {
    //                 setAppointments(res);
    //                 setIsLoadingAppointments(false);
    //                 setCustomerHasChanged(false);
    //             }, `appointments/`, authTokens, { "customer_id": fields.customer })
    //         }
    //     }, [customerHasChanged]);
    // } catch (e) {
    //     console.log("ERROR: " + e);
    // }

    useEffect(() => {
        fetch(`${BASE_URL}appointments?invoice=None`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => res.json())
        .then(json => {
            console.log("JSON: ", json);
            setAppointments(json);
            setIsLoading(false);
        })
    }, []);

    function getAmount() {
        return appointments.find(appointment => appointment.id == selectedAppointment).fee
    }

    function handleSubmit(e) {
        e.preventDefault();
        // setIsLoadingAppointments(true);
        // setCustomerHasChanged(true);
        // return;
        fetch(`${BASE_URL}invoices/`, {
            method: "POST",
            headers: {
                'Authorization': `Token ${authTokens}`,
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                appointment: selectedAppointment,
                amount: getAmount()
            })
        })
        .then(res => {
            if (res.ok) navigate("/dashboard");
            else alert("ERROR!");
        })
    }


    return (
        <>
        { !isLoading && appointments.length > 0 ?
        <div className="container-v">
            <h2>Create an Invoice</h2>
            <form className="form-single" onSubmit={handleSubmit}>
                {/* <label>Customer: </label> 
                <select id="customer" value={fields.customer} onChange={(e) => handleFieldChange({ customer: e.target.value})}> */}
                    {/* default/empty option? */}
                    {/* <option>--Select--</option>
                    {customers.map(customer => 
                        <option value={customer.id} key={customer.id}>{customer.last_name}, {customer.first_name}</option>    
                    )}
                </select> */}
                {/* <SelectInput label={"appointment"} options={appointments} fields={{ "appointment": "" }} handleFieldChange={setSelectedAppointment} /> */}
                {/* <TextInput label={"start date"} type={"date"} fields={fields} handleFieldChange={handleFieldChange}/>
                <TextInput label={"end date"} type={"date"} fields={fields} handleFieldChange={handleFieldChange}/> */}
                <div className="container-h form-row">
                    <label>Appointments: </label>
                    <select id="appointment" value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)}>
                        {/* default/empty option? */}
                        <option>--Select--</option>
                        {appointments.map(option => 
                            <option value={option.id} key={option.id}>{option.customer_name}, {option.date_time}</option>    
                        )}
                    </select>
                </div>
                <div className="container-h form-row">
                    { selectedAppointment != -1 &&
                        <>
                            <div>Amount: </div><div>${getAmount()}</div>
                        </>
                    }
                </div>
                <SubmitButton validateForm={validateForm}/>
                
                {/* <label for="start_date">Start Date: </label>
                <input id="start_date" type="date" value={fields.start_date} onChange={(e) => handleFieldChange({ start_date: e.target.value})}></input>
                <label for="end_date">End Date: </label>
                <input id="end_date" type="date" value={fields.end_date} onChange={(e) => handleFieldChange({ end_date: e.target.value})}></input> */}
                {/* <input type="submit"></input> */}
            </form>
            
            { !isLoadingAppointments &&
            <form>
                <div><input type="submit" value="Create Invoice"></input></div>
                <div>
                    <input type="checkbox"></input>
                    <label>Select All</label>
                </div>
                { appointments.map((appointment, i) =>
                    <div>
                        <input type="checkbox"></input>
                        <span>{appointment.date_time} - {appointment.length} hrs ${appointment.fee}</span>
                    </div>
                )}
            </form>
            }
        </div>
        :
        <div>No Appointments</div>
        }
        </>
    );
}