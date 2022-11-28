import {
    Routes,
    Route,
} from "react-router-dom";
import Home from "./home";
import Login from "./login";
import Signup from "./signup";
import Dashboard from "./dashboard";
import Users from "./users";
import Customers from "./customers";
import Customer from "./customer";
import EditCustomer from "./editCustomer";
import DeleteCustomer from "./deleteCustomer";
import CreateCustomer from "./createCustomer";
import Appointments from "./appointments";
import CreateAppointment from "./createAppointment";
import EditAppointment from "./editAppointment";
import DeleteAppointment from "./deleteAppointment";
import Appointment from "./appointment";
import AppointmentNotes from "./appointment_notes";
import CreateAppointmentNote from "./createAppointmentNote";
import EditAppointmentNote from "./editAppointmentNote";
import CreateStatement from "./CreateStatement";
import Statements from "./Statements"
import Statement from "./Statement"
import CreatePayment from "./CreatePayment";
import Payments from "./Payments";
import Payment from "./Payment";
import DeletePayment from "./deletePayment";
import EditPayment from "./editPayment";
import CreateInvoice from "./CreateInvoice";
import Invoices from "./Invoices";
import Invoice from "./Invoice";
import CreateReceipt from "./CreateReceipt";
import Receipts from "./Receipts";
import Receipt from "./Receipt";
import CreatePrepaidAppointment from "./CreatePrepaidAppointment";
import PrepaidAppointments from "./PrepaidAppointments";
import PrepaidAppointment from "./PrepaidAppointment";
import Settings from "./Settings";
import { AppContext } from "../util/context";
import { useState } from 'react';
import ViewAppointmentNote from "./viewAppointmentNote";

export default function Links() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/demo" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:customerId" element={<Customer />} />
            <Route path="/customers/:customerId/edit" element={<EditCustomer />} />
            <Route path="/customers/:customerId/delete" element={<DeleteCustomer />} />
            <Route path="/createCustomer" element={<CreateCustomer />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/createAppointment" element={<CreateAppointment />} />
            <Route path="/appointments/:appointmentId/edit" element={<EditAppointment />} />
            <Route path="/appointments/:appointmentId/delete" element={<DeleteAppointment />} />
            <Route path="/appointments/:appointmentId" element={<Appointment />} />
            <Route path="/appointment_notes" element={<AppointmentNotes />} />
            <Route path="/appointment_notes/:appointmentNoteId" element={<ViewAppointmentNote />} />
            <Route path="appointment_notes/create" element={<CreateAppointmentNote />} />
            <Route path="appointment_notes/:appointmentNoteId/edit" element={<EditAppointmentNote />} />
            {/* <Route path="/appointments/:appointmentId/createAppointmentNote" element={<CreateAppointmentNote />} /> */}
            <Route path="/appointments/:appointmentId/edit" element={<EditAppointmentNote />} />
            <Route path="/statements/create" element={<CreateStatement />} />
            <Route path="/statements" element={<Statements />} />
            <Route path="/statements/:statementId" element={<Statement />} />
            <Route path="/payments/create" element={<CreatePayment />} />
            <Route path="/payments/create/customer/:customerId" element={<CreatePayment />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/:paymentId" element={<Payment />} />
            <Route path="/payments/:paymentId/delete" element={<DeletePayment />} />
            <Route path="/payments/:paymentId/edit" element={<EditPayment />} />
            <Route path="/invoices/:invoiceId/create" element={<CreateInvoice />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/create" element={<CreateInvoice />} />
            <Route path="/invoices/:invoiceId" element={<Invoice />} />
            {/* <Route path="/receipts/create" element={<CreateReceipt/>} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/receipts/:receiptId" element={<Receipt />} />
            <Route path="/prepaid_appointments/create" element={<CreatePrepaidAppointment />} />
            <Route path="/prepaid_appointments" element={<PrepaidAppointments />} />
            <Route path="/prepaid_appointments/:prepaid_appointmentId" element={<PrepaidAppointment />} /> */}
            <Route path="/settings" element={<Settings />} />
            <Route
                path="*"
                element={
                    <main style={{ padding: "1rem" }}>
                        <p>There's nothing here!</p>
                    </main>
                }
            />
        </Routes >
    );
}