import { useEffect, useState } from "react";
import { useFormFields } from "../util/hooks";
import { getData, validateForm } from "../util/helpers"
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import TextInput from "../components/FormTextInput";
import SubmitButton from "../components/SubmitButton";
import CustomerName from "../components/CustomerName";

export default function EditPayment() {
    let params = useParams();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [fields, handleFieldChange] = useFormFields({ 
        customer: "", 
        customer_name: "",
        date: "",
        amount: "",
     });
    const [isLoading, setIsLoading] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
        if (authTokens) {
            fetch(BASE_URL + "payments/" + params.paymentId + "/", {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                handleFieldChange({
                    customer: json.customer,
                    customer_name: json.customer_name,
                    date: json.date,
                    amount: json.amount,
                });
                setIsLoading(false);
            });
        }
        else {
            navigate("/");
        }
    }, [])

    function handleSubmit(e) {
        e.preventDefault();
            try {
                fetch(`${BASE_URL}payments/${params.paymentId}/`, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Token ${authTokens}`,
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        customer: fields.customer,
                        date: fields.date,
                        amount: fields.amount,
                    })
            })
            .then(res => {
                if (res.ok) navigate("/payments");
                else console.log("ERROR!");
            })
            } catch (e) {
                alert("Error!: " + e);
            }
    }

    return ( 
        <>
            { !isLoading &&
                <div className="container-v">
                    <h2>Edit Payment</h2>
                    <form className="form-single" onSubmit={handleSubmit}>
                        <CustomerName name={fields.customer_name} id={fields.customer} />
                        <TextInput type="date" label="date" fields={fields} handleFieldChange={handleFieldChange} />
                        <TextInput type="amount" label="amount" fields={fields} handleFieldChange={handleFieldChange} />
                        <SubmitButton validateForm={validateForm}/>
                    </form>
                </div>
            }
        </>
        
    );
  }