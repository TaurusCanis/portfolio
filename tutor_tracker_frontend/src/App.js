import "./App.css";
import { useState } from "react";
import Routes from "./routes/Routes";
import Navbar from "./routes/Navbar";
import { AppContext } from "./util/context";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";

export default function App() {
  // const [isAuthenticated, userHasAuthenticated] = useState(false);
  // const [token, setToken] = useState();
  return (
    <div className="App">
      {/* <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated, token, setToken }}> */}
      <AuthProvider>
        <div className="container-v">
          <Navbar />
          <main className="container-v">
            <Routes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
      {/* </AppContext.Provider> */}
    </div>
  );
}

  