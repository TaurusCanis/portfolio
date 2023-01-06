import { useFormFields } from "../hooks";
import { validateForm } from "../helpers";
// import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import TextInput from "./TextInput";
import SubmitButton from "./SubmitButton";
import AppContext from "../AppContext";

export default function SignupComponent() {
    const { registerUser } = useContext(AppContext);
    const [fields, handleFieldChange] = useFormFields({ first_name: "", last_name: "", email: "", username: "", password: "" });

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            registerUser(fields);
        } catch (e) {
            alert("Error!: " + e);
        }
    }

    return ( 
        <div className="container-v homepage-form">
            <h2>Sign up</h2>
            <form onSubmit={handleSubmit}>
                <TextInput label="first name" type="text" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="last name" type="text" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="email" type="email" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="username" type="text" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="password" type="password" fields={fields} handleFieldChange={handleFieldChange} />
                <SubmitButton fields={fields}  validateForm={validateForm}/>
            </form>
        </div>
    );
  }