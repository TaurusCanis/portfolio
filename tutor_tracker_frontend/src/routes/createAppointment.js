import { useEffect, useState } from "react";
import { useFormFields } from "../util/hooks";
import { getData, validateForm } from "../util/helpers";
import { useAppContext } from "../util/context";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TextInput from "../components/FormTextInput";
import SubmitButton from "../components/SubmitButton";
import SelectInput from "../components/SelectInput";
import CreateButton from "../components/CreateButton";

export default function CreateAppointment() {
    const [fields, handleFieldChange] = useFormFields({ 
        customer: "", 
        date: "",
        time: "",
        length: "",
        fee: "",
     });
    const [customers, setCustomers] = useState([]);
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    let navigate = useNavigate();
    const [customer, setCustomer] = useState();
    const { state } = useLocation();

    useEffect(() => {
        if (authTokens) {
            if (state != null) {
                setCustomer(state.customer);
                handleFieldChange({
                    ...fields,
                    customer: state.customer.id,
                })
                setIsLoading(false);
            } else {
                fetch(`${BASE_URL}customers/`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Token ${authTokens}`,
                    }
                })
                .then(res => res.json())
                .then(json => {
                    console.log("customers: ", json)
                    setCustomers(json);
                    setIsLoading(false);
                })
            }
        }
        else {
            navigate("/");
        }

    }, [])

    function validateForm(fields) {
        return !Object.values(fields).some((e) => e == "");
    }

    function handleSubmit(e) {
        e.preventDefault();

        try {
            fetch(BASE_URL + 'appointments/', {
                method: "POST",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    customer_id: fields.customer,
                    customer: fields.customer,
                    date_time: fields.date + "T" + fields.time,
                    length: fields.length,
                    fee: fields.fee,
                })
            })
            .then((response) => response.json())
            .then(res => {
                console.log(res);
                navigate("/appointments");
            })
        } catch (e) {
            alert("Error!: " + e);
        }
    }

    return (
        <>
        { !isLoading &&
        <>
            <h2>Create New Appointment</h2>
            <form className="form-single" onSubmit={handleSubmit}>
                { customer != null ?
                <>
                    <h3>Customer: {`${customer.last_name}, ${customer.first_name}`}</h3>
                </>
                :
                <SelectInput label="customer" fields={fields} handleFieldChange={handleFieldChange} options={customers}/>
                }
                
                <TextInput label="date" type="date" fields={fields} handleFieldChange={handleFieldChange} />
                        <TextInput label="time" type="time" fields={fields} handleFieldChange={handleFieldChange} />
                        <TextInput label="length" type="number" fields={fields} handleFieldChange={handleFieldChange} />
                        <TextInput label="fee" type="number" fields={fields} handleFieldChange={handleFieldChange} />
                        <SubmitButton fields={fields}  validateForm={validateForm}/>
            </form>
        </>
        }
        </>
    );

    // return ( 
    //     <>
    //         { !isLoading && customers.length > 0 &&
    //             <div className="container-v">
    //                 <h2>Create New Appointment</h2>
    //                 <form className="form-single" onSubmit={handleSubmit}>
    //                     <SelectInput label="customer" options={customers} fields={fields} handleFieldChange={handleFieldChange}/>
    //                     <TextInput label="date" type="date" fields={fields} handleFieldChange={handleFieldChange} />
    //                     <TextInput label="time" type="time" fields={fields} handleFieldChange={handleFieldChange} />
    //                     <TextInput label="length" type="number" fields={fields} handleFieldChange={handleFieldChange} />
    //                     <TextInput label="fee" type="number" fields={fields} handleFieldChange={handleFieldChange} />
    //                     <SubmitButton fields={fields}  validateForm={validateForm}/>
    //                 </form>
    //             </div>
    //         }
    //         { customers.length == 0 && 
    //             <>
    //                 <h3>No Customers</h3>
    //                 <CreateButton url={`/createCustomer/`} label="Add a Customer" />
    //             </>
    //         }
    //     </>
        
    // );
  }