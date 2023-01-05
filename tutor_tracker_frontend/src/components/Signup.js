import { useFormFields } from "../util/hooks";
import { validateForm } from "../util/helpers";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import TextInput from "./FormTextInput";
import SubmitButton from "./SubmitButton";

export default function SignupComponent() {
    const { registerUser } = useContext(AuthContext);
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
        <div class="formbg-outer">
          <div class="formbg">
            <div class="formbg-inner padding-horizontal--48">
              <span class="padding-bottom--15">Sign up for an account</span>
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


        
    );
  }

  {/* <div className="container-v homepage-form">
            <h2>Sign up</h2>
            <form onSubmit={handleSubmit}>
                <TextInput label="first name" type="text" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="last name" type="text" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="email" type="email" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="username" type="text" fields={fields} handleFieldChange={handleFieldChange} />
                <TextInput label="password" type="password" fields={fields} handleFieldChange={handleFieldChange} />
                <SubmitButton fields={fields}  validateForm={validateForm}/>
            </form>
        </div> */}