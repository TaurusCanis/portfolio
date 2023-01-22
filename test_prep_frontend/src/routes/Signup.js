import { useFormFields } from "../hooks";
import { validateForm } from "../helpers";
import AppContext from "../AppContext";
import { useContext } from "react";
// import SubmitButton from "./SubmitButton";

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
        <div className="form-display">
            <div class="formbg-outer">
            <div class="formbg">
                <div class="formbg-inner padding-horizontal--48">
                <span class="padding-bottom--15 span-form">Sign up for an account</span>
                <form id="stripe-login" onSubmit={handleSubmit}>
                    <div class="field padding-bottom--24">
                    <input type="text" name="first_name" placeholder="First Name"
                        id="first_name" value={fields["first_name"]} onChange={(e) => handleFieldChange({ "first_name": e.target.value})}
                    />
                    </div>
                    <div class="field padding-bottom--24">
                    <input type="text" name="last_name" placeholder="Last Name"
                        id="last_name" value={fields["last_name"]} onChange={(e) => handleFieldChange({ "last_name": e.target.value})}
                    />
                    </div>
                    <div class="field padding-bottom--24">
                    <input type="email" name="email" placeholder="Email"
                        id="email" value={fields["email"]} onChange={(e) => handleFieldChange({ "email": e.target.value})}
                    />
                    </div>
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