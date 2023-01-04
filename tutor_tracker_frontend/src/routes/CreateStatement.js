import { useEffect, useState } from "react";
import { getData, validateForm } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useFormFields } from "../util/hooks";
import { useNavigate } from "react-router-dom";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/FormTextInput";
import SubmitButton from "../components/SubmitButton";

export default function CreateStatement() {
    const [customers, setCustomers] = useState();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [fields, handleFieldChange] = useFormFields({ 
        customer: "", 
        start_date: "",
        end_date: "",
     });
     let navigate = useNavigate();

    // useEffect(() => {
    //     try {
    //         getData((res) => setCustomers(res), "customers", authTokens);
    //     }
    //     catch (e) {
    //         // How to handle error?
    //         console.log("ERROR: " + e);
    //     }
    // }, []);

    useEffect(() => {
        fetch(`${BASE_URL}customers/`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${authTokens}`
            }
        })
        .then(res => res.json())
        .then(json => {
            setCustomers(json);
            return json;
        })
    }, [])

    function handleSubmit(e) {
        e.preventDefault();

        try {
            fetch(`${BASE_URL}statements/`, {
                method: "POST",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    // customer_id: fields.customer,
                    customer: fields.customers,
                    start_date: fields.start_date,
                    end_date: fields.end_date,
                })
            })
            .then((response) => response.json())
            .then(res => {
                console.log(res);
                navigate("/statements");
            })
        } catch (e) {
            alert("Error!: " + e);
        }
    }

    return (
        <div className="container-v">
            <h2>Create a New Statement</h2>
        { customers &&
            <form className="form-single" onSubmit={handleSubmit}>
                {/* <label for="customer">Customer: </label>
                <select id="customer" value={fields.customer} onChange={(e) => handleFieldChange({ customer: e.target.value})}> */}
                    {/* default/empty option? */}
                    {/* <option>--Select--</option>
                    {customers.map(customer => 
                        <option value={customer.id} key={customer.id}>{customer.last_name}, {customer.first_name}</option>    
                    )}
                </select> */}
                <SelectInput options={customers} label="customers" fields={fields} handleFieldChange={handleFieldChange}/>
                <TextInput label="start date" type="date" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="end date" type="date" fields={fields} handleFieldChange={handleFieldChange} />
                <SubmitButton validateForm={validateForm} />

                {/* <label for="start_date">Start Date: </label>
                <input id="start_date" type="date" value={fields.start_date} onChange={(e) => handleFieldChange({ start_date: e.target.value})}></input>
                <label for="end_date">End Date: </label>
                <input id="end_date" type="date" value={fields.end_date} onChange={(e) => handleFieldChange({ end_date: e.target.value})}></input>
                <input type="submit"></input> */}
            </form>
        }
        </div>
    );
}