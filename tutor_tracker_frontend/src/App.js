import "./App.css";
import { useState } from "react";
import Routes from "./routes/Routes";
import Navbar from "./routes/Navbar";
import { AppContext } from "./util/context";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import Footer2 from "./components/Footer2";
import Navbar2 from "./components/Navbar2";

export default function App() {

  return (
    <div className="App">
      <AuthProvider>
        <div className="container-v">
        {/* <div> */}
          <Navbar />
          {/* <Navbar2 /> */}
          <main className="container-v">
          {/* <main role="main"> */}
            <Routes />
          </main>
          {/* <Footer2 /> */}
          <Footer />
        </div>
      </AuthProvider>
    </div>
  );
}

  