import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export function AuthProvider({ children }) {
    const BASE_URL = "http://127.0.0.1:8000/tracker-api/";

    const [authTokens, setAuthTokens] = useState(() => {
        const token = localStorage.getItem("authTokens");
        return token ? JSON.parse(token) : null;
    });

    const [userId, setUserId] = useState(() => {
        const userId = localStorage.getItem("userId");
        return userId ? JSON.parse(userId) : null;
    });

    const [currentUserData, setCurrentUserData] = useState(() => {
        const currentUserData = localStorage.getItem("currentUserData");
        return currentUserData ? JSON.parse(currentUserData) : null;
    });

    const navigate = useNavigate();
    // const [userHasAuthenticated, setUserHasAuthenticated] = useState(() => localStorage.getItem("authTokens"));

    const registerUser = async(fields) => {
        console.log("FIELDS***: ", JSON.stringify(fields));
        const response = await fetch(BASE_URL + 'users/', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(fields),
            });

            if (response.ok) {
                console.log("RESPONSE: ", response)
                // userHasAuthenticated(true);
                const jsonData = await response.json();
                setUserId(jsonData['id']);
                localStorage.setItem("userId", JSON.stringify(jsonData['id']));
                await loginUser(fields.username, fields.password);
                // navigate("/dashboard");
            }
            else {
                const data = await response.json(); 
                for (let [k,v] of Object.entries(data)) {
                    console.log(k, ": ", v)
                }
            }
    }
    

    const getUser = async (token) => {
        return fetch(BASE_URL + "users/?current_user=true", {
            method: "GET",
            headers: {
                'Authorization': `Token ${token}`,
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log("USER DATA**********: ", json);
            return json;
        });
    }
    
    const loginUser = async (username, password) => {
        console.log("username: ", username, " password: ", password);
        const response = await fetch(BASE_URL + 'api-token-auth/', {
            method: "POST",
            headers: {
                // 'Accept': 'application/json, text/plain',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });

        const data = await response.json();
        if (response.status == 200) {
            setAuthTokens(data.token);
            console.log("data: " + JSON.stringify(data.token));
            localStorage.setItem("authTokens", JSON.stringify(data.token));
            // userHasAuthenticated(true);
            console.log("DATA----->>>>: ", data);
            const userData = await getUser(data.token);
            console.log("LALALA")
            setCurrentUserData(userData[0]);
            localStorage.setItem("currentUserData", JSON.stringify(userData[0]));
            navigate("/dashboard");
        } else {
            console.log(response);
            console.log("ERROR: ", response)
        }
    }

    function logoutUser() {
        console.log("FUCK FUCK FUCK")
        setAuthTokens(null);
        localStorage.removeItem("authTokens");
        localStorage.removeItem("userId");
        console.log("FUCKYOU")
        navigate("/login");
       
        console.log("ASSHOLE")
    };

    const contextData = {
        authTokens, loginUser, logoutUser, registerUser, userId, currentUserData, BASE_URL, getUser, setCurrentUserData
    };

    return (
        <AuthContext.Provider value={ contextData }>
            { children }
        </AuthContext.Provider>
    )
}
