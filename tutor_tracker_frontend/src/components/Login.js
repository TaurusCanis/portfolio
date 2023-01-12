import { useFormFields } from "../util/hooks";
import { validateForm } from "../util/helpers";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import TextInput from "../components/FormTextInput";
import SubmitButton from "./SubmitButton";
import Message from "./Message";

export default function LoginComponent() {
    const [fields, handleFieldChange] = useFormFields({ username: "Muddy", password: "Waters" });
    const { loginUser } = useContext(AuthContext);

    function handleSubmit(e) {
        e.preventDefault();
        loginUser(fields.username, fields.password);
    }

    return ( 
        <div class="formbg-outer">
          <div class="formbg">
            <div class="formbg-inner padding-horizontal--48">
              <span class="padding-bottom--15">Sign in to your account</span>
              <span className="padding-bottom--15">To Demo, sign-in with username "Muddy" and password "Waters"</span>
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

        // <div className="container-v homepage-form">
        //     <h2>Login</h2>
        //     <form onSubmit={handleSubmit} >
        //         <TextInput label="username" type="text" fields={fields} handleFieldChange={handleFieldChange} />
        //         <TextInput label="password" type="password" fields={fields} handleFieldChange={handleFieldChange} />
        //         <SubmitButton fields={fields}  validateForm={validateForm}/>
        //         <Message message="To test the app, login with username Muddy and password Waters." 
        //         />
        //     </form>
        // </div>
    );
  }