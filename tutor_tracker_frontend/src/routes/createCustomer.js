import { useFormFields } from "../util/hooks";
import { validateForm } from "../util/helpers";
import { useAppContext } from "../util/context";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/FormTextInput";
import SubmitButton from "../components/SubmitButton";

export default function CreateCustomer() {
    const [fields, handleFieldChange] = useFormFields({ first_name: "", last_name: "", email: "" });
    const { authTokens, BASE_URL } = useContext(AuthContext);
    let navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if (authTokens) {
            fetch(`${BASE_URL}customers/`, {
                method: "POST",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    first_name: fields.first_name,
                    last_name: fields.last_name,
                    email_primary: fields.email,
                })
            })
            .then((response) => response.json())
            .then(res => {
                console.log(res);
                navigate('/customers');
            })
        } else {
            navigate("/")
        }
    }

    return ( 
        <div className="container-v">
            <h2>Create New Customer</h2>
            <form className="form-single" onSubmit={handleSubmit}>
                <TextInput label="first name" type="text" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="last name" type="text" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="email" type="email" fields={fields} handleFieldChange={handleFieldChange} />
                <SubmitButton validateForm={validateForm}/>
            </form>
        </div>
    );
  }