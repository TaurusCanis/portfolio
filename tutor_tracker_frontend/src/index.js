import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import './styles.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <React.StrictMode>
        <BrowserRouter basename="/tracker">
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  // <BrowserRouter>
  //   <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
  //   <Routes>
  //     <Route path="/" element={<App />}>
  //       <Route path="/home" element={<Home />} />
  //       <Route path="/login" element={<Login />} />
  //       <Route path="/signup" element={<Signup />} />
  //       <Route path="/dashboard" element={<Dashboard />} />
  //       <Route path="/users" element={<Users />} />
  //       <Route path="/customers" element={<Customers />} />
  //       <Route path="/customers/:customerId" element={<Customer />} />
  //       <Route path="/createCustomer" element={<CreateCustomer />} />
  //       <Route path="/appointments" element={<Appointments />} />
  //       <Route path="/createAppointment" element={<CreateAppointment />} />
  //       <Route path="/appointments/:appointmentId/edit" element={<EditAppointment />} />
  //       <Route path="/appointments/:appointmentId" element={<Appointment />} />
  //       <Route path="/appointment_notes" element={<AppointmentNotes />} />
  //       <Route
  //         path="*"
  //         element={
  //           <main style={{ padding: "1rem" }}>
  //             <p>There's nothing here!</p>
  //           </main>
  //         }
  //       />
  //     </Route>
  //   </Routes>
  //   </AppContext.Provider>
  // </BrowserRouter>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
