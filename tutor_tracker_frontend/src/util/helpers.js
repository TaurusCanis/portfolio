export function getAppointmentStatus(appointment_status) {
    switch (appointment_status) {
        case "C": 
            return "Complete"; 
        case "X-C":
            return "Cancelled - Charge";
        case "X-N":
            return "Cancelled - No Charge";
        default:
            return "Scheduled";
    }
}

export function getCustomers(users, setUsers) {
    fetch('http://127.0.0.1:8000/tracker/customers/', {
      method: "GET",
    })
      .then((response) => response.json())
      .then(res => {
        console.log(res)
        setUsers([...users, ...res])
      })
      .then(() => console.log("users: ", users))
      return;
  }

  export function getData(setValues, path, token, data) {
    // if (!["customers", "appointments"].includes(path)) {
    //     throw new Error("path not found");
    // }
    console.log("DATA: ", data);
    let url = `http://127.0.0.1:8000/tracker/${path}`;
    if (data != undefined) {
      console.log("HERE");
      url += "?"
      for (const [key, value] of Object.entries(data)) {
        url = url.concat('',key).concat("=",value).concat('', "&");
      }
      url = url.slice(0,-1);
    } 
    console.log("URL: ", url);

    fetch(url, {
      method: "GET",
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then(res => {
        console.log(res)
        setValues(res);
      })
      .then(() => console.log("values: "))
      return;
  }

  export function validateForm(fields) {
    console.log("fields: ", fields)
    for (const value in fields) {
        if (fields[value].length === 0) return false;
    }
    return true;
  }