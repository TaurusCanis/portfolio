import { useFormFields } from "../util/hooks";
import { validateForm } from "../util/helpers";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import TextInput from "../components/FormTextInput";
import SubmitButton from "./SubmitButton";
import Message from "./Message";

export default function LoginComponent() {
    const [fields, handleFieldChange] = useFormFields({ username: "", password: "" });
    const { loginUser } = useContext(AuthContext);

    function handleSubmit(e) {
        e.preventDefault();
        loginUser(fields.username, fields.password);
    }

    return ( 
        <div className="container-v homepage-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} >
                <TextInput label="username" type="text" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="password" type="password" fields={fields} handleFieldChange={handleFieldChange} />
                <SubmitButton fields={fields}  validateForm={validateForm}/>
                <Message message="To test the app, login with username Muddy and password Waters." 
                />
            </form>
        </div>
    );
  }