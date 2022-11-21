import { useEffect, useState } from "react";
import { useFormFields } from "../util/hooks";
import { getData, validateForm } from "../util/helpers"
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import TextInput from "../components/FormTextInput";
import SubmitButton from "../components/SubmitButton";

export default function EditCustomer() {
    let params = useParams();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [fields, handleFieldChange] = useFormFields({ first_name: "", last_name: "", email_primary: "" });
    const [isLoading, setIsLoading] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
        if (authTokens) {
            fetch(BASE_URL + "customers/" + params.customerId + "/", {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then(res => res.json())
            .then(json => {
                console.log("customer: ", json);
                handleFieldChange({
                    first_name: json.first_name,
                    last_name: json.last_name,
                    email_primary: json.email_primary,
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
                fetch(`${BASE_URL}customers/${params.customerId}/`, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Token ${authTokens}`,
                        'Accept': 'application/json, text/plain',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        first_name: fields.first_name,
                        last_name: fields.last_name,
                        email_primary: fields.email_primary
                    })
            })
            .then(res => {
                if (res.ok) navigate("/customers");
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
                    <h2>Edit Customer</h2>
                    <form className="form-single" onSubmit={handleSubmit}>
                        <TextInput type="text" label="first name" fields={fields} handleFieldChange={handleFieldChange} />
                        <TextInput type="text" label="last name" fields={fields} handleFieldChange={handleFieldChange} />
                        <TextInput type="email" label="email primary" fields={fields} handleFieldChange={handleFieldChange} />
                        <SubmitButton validateForm={validateForm}/>
                    </form>
                </div>
            }
        </>
        
    );
  }