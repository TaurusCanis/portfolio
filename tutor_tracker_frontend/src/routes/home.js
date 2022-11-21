import { useState } from "react";
import LoginComponent from "../components/Login";
import SignupComponent from "../components/Signup";
import Message from "../components/Message";

export default function Home() {
    return (
      <>
       
        <h2>TutorTracker</h2>
        <h3>The Business Management Solution for Self-Employed Tutors</h3>
        <div className="container-h form-group">
          <LoginComponent />
          <SignupComponent />
        </div>
      </>
    );
  }