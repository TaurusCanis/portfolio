import { useState, useEffect } from "react";

export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/tracker/users/', {
          method: "GET",
        })
          .then((response) => response.json())
          .then(res => {
            console.log(res)
            setUsers([...users, ...res])
          })
          .then(() => console.log("users: ", users))
      }
    , [])


    return (
      <div>
        <>
        {users.map((user, i) =>
          <div key={i}>{user.first_name} - {i}</div>  
        )}
        </>
      
      </div>
    );
  }