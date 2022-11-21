import { useFormFields } from "../util/hooks";
import { useState, useEffect } from "react";
import { getData, validateForm } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TextInput from "../components/FormTextInput";
import SubmitButton from "../components/SubmitButton";
import SelectInput from "../components/SelectInput";

export default function CreatePayment() {
    const [fields, handleFieldChange] = useFormFields({ 
        customer: "", 
        date: "",
        amount: "",
     });
     const [customers, setCustomers] = useState();
     const { authTokens, BASE_URL } = useContext(AuthContext);
     const [isLoading, setIsLoading] = useState(true);
     let navigate = useNavigate();
     const { state } = useLocation();
     const [customer, setCustomer] = useState(null);

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
                    setCustomers(json);
                    setIsLoading(false);
                })
            }
        }
        else {
            navigate("/");
        }
        
    }, [])

    function handleSubmit(e) {
        e.preventDefault();

        try {
            fetch(BASE_URL + 'payments/', {
                method: "POST",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    customer_id: fields.customer,
                    customer: fields.customer,
                    date: fields.date,
                    amount: fields.amount,
                })
            })
            .then((response) => response.json())
            .then(res => {
                console.log(res);
                navigate("/payments");
            })
        } catch (e) {
            alert("Error!: " + e);
        }
    }

    return (
        <>
        { !isLoading &&
        <>
            <h2>Create Payment</h2>
            <form className="form-single" onSubmit={handleSubmit}>
                { customer != null ?
                <>
                    <h3>Customer: {`${customer.last_name}, ${customer.first_name}`}</h3>
                </>
                :
                <SelectInput label="customer" fields={fields} handleFieldChange={handleFieldChange} options={customers}/>
                }
                
                <TextInput label="date" type="date" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="amount" type="number" fields={fields} handleFieldChange={handleFieldChange} />
                <SubmitButton validateForm={validateForm}/>
            </form>
        </>
        }
        </>
    );
}