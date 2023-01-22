import { useFormFields } from "../hooks";
import { validateForm } from "../helpers";
import { useContext } from "react";
import AppContext from "../AppContext";
// import TextInput from "../components/FormTextInput";
// import SubmitButton from "./SubmitButton";
// import Message from "./Message";

export default function LoginComponent() {
    const [fields, handleFieldChange] = useFormFields({ username: "Chuck", password: "Berry" });
    const { loginUser } = useContext(AppContext);

    function handleSubmit(e) {
        e.preventDefault();
        loginUser(fields.username, fields.password);
    }

    return ( 
        <div className="form-display">
            <div class="formbg-outer">
            <div class="formbg">
                <div class="formbg-inner padding-horizontal--48">
                <span class="padding-bottom--15 span-form">Sign in to your account</span>
                <span className="padding-bottom--15 span-form">To Demo, sign-in with username "Chuck" and password "Berry"</span>
                <form id="stripe-login" onSubmit={handleSubmit}>
                    <div class="field padding-bottom--24">
                    <input type="text" name="username" placeholder="Username"
                        id="username" value={fields["username"]} onChange={(e) => handleFieldChange({ "username": e.target.value})}
                    />
                    </div>
                    <div class="field padding-bottom--24">
                    <input type="password" name="password" placeholder="Password"
                        id="password" value={fields["password"]} onChange={(e) => handleFieldChange({ "password": e.target.value})}
                    />
                    </div>
                    <div class="field padding-bottom--24">
                    <input type="submit" name="submit" value="Continue" />
                    </div>
                    {/* <div class="reset-pass padding-bottom--24">
                        <a href="#">Forgot your password?</a>
                    </div> */}
                </form>
                </div>
            </div>
            </div>
        </div>
    );
  }