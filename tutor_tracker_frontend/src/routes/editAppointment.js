import { useEffect, useState } from "react";
import { useFormFields } from "../util/hooks";
import { getData, validateForm } from "../util/helpers"
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import TextInput from "../components/FormTextInput";
import SubmitButton from "../components/SubmitButton";
import RadioSelectGroup from "../components/RadioSelectGroup";
import CustomerName from "../components/CustomerName";

export default function EditAppointment() {
    let params = useParams();
    const { authTokens, BASE_URL } = useContext(AuthContext);
    const [fields, handleFieldChange] = useFormFields({ 
        customer: "", 
        date: "",
        time: "",
        length: "",
        fee: "",
     });
     let navigate = useNavigate();

    async function getFieldData(data) {
        const date_time = data.date_time.split("T");
        return {
            customer: data.customer, 
            customer_id: data.customer_id,
            date: date_time[0],
            time: date_time[1].split("-")[0],
            length: data.length,
            fee: data.fee,
            status: data.status,
        }
    }

    // try {
    //     useEffect(() => getData((res) => getFieldData(res).then(res => handleFieldChange(res)), `appointments/${params.appointmentId}`, authTokens), []);
    // } catch (e) {
    //     console.log("ERROR: " + e);
    // }

    // useEffect(() => getCustomers(users, setUsers), []);

    useEffect(() => {
        if (authTokens) {
            fetch(`${BASE_URL}appointments/${params.appointmentId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Token ${authTokens}`
                }
            })
            .then((response) => response.json())
            .then(res => {
                const date_time = res.date_time.split("T");
                const day = date_time[0]
                const time = date_time[1].split("-")[0].split("Z")[0];
                console.log("RES: ", res);
                const { appointment_note, ...rest } = res;
                handleFieldChange({
                    
                    ...fields, ...rest,
                    date: day,
                    time: time,
                });
                console.log("appointment: ", res);
            })
        } else {
            navigate("/");
        }
    }, []);

    function updateStates(res) {
        // setAppointment(res);
        // const date = new Date(res.date_time);
        // setDate(date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        // setTime(date.toLocaleTimeString('en-US'));
        // setNote(getNoteStatus(res.appointment_note));
        return;
    }



    function handleSubmit(e) {
        e.preventDefault();
        try {
            fetch(`${BASE_URL}appointments/${params.appointmentId}/`, {
                method: "PUT",
                headers: {
                    'Authorization': `Token ${authTokens}`,
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    customer: fields.customer,
                    customer_id: fields.customer_id,
                    date_time: fields.date + "T" + fields.time,
                    length: fields.length,
                    fee: fields.fee,
                    status: fields.status,
                })
            })
                .then(res => {
                    if (res.ok) navigate(`/appointments/${params.appointmentId}`);
                    else console.log("ERROR!");
                })
        } catch (e) {
            alert("Error!: " + e);
        }
    }

    return ( 
        <>
            
            <div className="container-v">
                <h2>Edit Appointment</h2>
                    <form className="form-single" onSubmit={handleSubmit}>
                        <CustomerName name={fields.customer_name} id={fields.customer_id} />
                        <TextInput label="date" type="date" fields={fields} handleFieldChange={handleFieldChange} />
                        <TextInput label="time" type="time" fields={fields} handleFieldChange={handleFieldChange} />
                        <TextInput label="length" type="number" fields={fields} handleFieldChange={handleFieldChange} />
                        <TextInput label="fee" type="number" fields={fields} handleFieldChange={handleFieldChange} />
                        <RadioSelectGroup group="statusButtons" keyName="status" fields={fields} handleFieldChange={handleFieldChange} 
                            options={[
                                [ 'Scheduled', 'S' ],
                                [ 'Completed', 'C' ],
                                [ 'Cancelled - Charge', 'X-C' ],
                                [ 'Cancelled - No Charge', 'X-N' ],
                            ]}
                        />
                        <SubmitButton fields={fields}  validateForm={validateForm}/>
                    </form>
                </div>
            {/* <form onSubmit={handleSubmit}>
                <label>Customer: </label>
                <span>{ fields.customer.last_name }, { fields.customer.first_name }</span>
                <label>Date: </label>
                <input type="date" id="date" value={fields.date} onChange={(e) => handleFieldChange({ date: e.target.value})} />
                <label>Time: </label>
                <input type="time" id="time" value={fields.time} onChange={(e) => handleFieldChange({ time: e.target.value})} />
                <label>Length: </label>
                <input type="number" id="length" value={fields.length} onChange={(e) => handleFieldChange({ length: e.target.value})} />
                <label>Fee: </label>
                <input type="number" id="fee" value={fields.fee} onChange={(e) => handleFieldChange({ fee: e.target.value})} />
                <div className="statusButtons">
                    <div className="radio">
                        <label>
                            <input type="radio" value="S" 
                                        checked={fields.status === 'S'} 
                                        onChange={(e) => handleFieldChange({ status: e.target.value})} />
                            Scheduled
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="C" 
                                        checked={fields.status === 'C'} 
                                        onChange={(e) => handleFieldChange({ status: e.target.value})} />
                            Completed
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="X-C" 
                                        checked={fields.status === 'X-C'} 
                                        onChange={(e) => handleFieldChange({ status: e.target.value})} />
                            Cancelled - Charge
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="X-N" 
                                        checked={fields.status === 'X-N'} 
                                        onChange={(e) => handleFieldChange({ status: e.target.value})} />
                            Cancelled - No Charge
                        </label>
                    </div>
                </div>
                <input type="submit" />
            </form> */}
        </>
    );
  }