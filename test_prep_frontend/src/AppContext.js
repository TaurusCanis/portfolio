import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export default AppContext;

export function AppProvider({ children }) {
    const PRODUCTION = true;

    const BASE_URL = PRODUCTION ? "https://andrewdole.com/test-prep-api/" : "http://127.0.0.1:8000/test-prep-api/";

    const navigate = useNavigate();

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

    const getUser = async (token) => {
        return fetch(BASE_URL + "users/?current_user=true", {
            method: "GET",
            headers: {
                'Authorization': `Token ${token}`,
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log("JSON: ", json);
            return json;
        });
    }

    const registerUser = async(fields) => {
        const response = await fetch(BASE_URL + 'users/', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                // body: JSON.stringify(fields),
                body: JSON.stringify({
                    prep_for_test: 'SSAT',
                    ...fields
                })
            });

            if (response.ok) {
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

    const loginUser = async (username, password) => {
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
            localStorage.setItem("authTokens", JSON.stringify(data.token));
            const userData = await getUser(data.token);
            setCurrentUserData(userData[0]);
            // localStorage.setItem("currentUserData", JSON.stringify(userData[0]));
            navigate("/dashboard");
        } else {
            console.log("ERROR: ", response)
        }
    }

    function logoutUser() {
        setAuthTokens(null);
        localStorage.removeItem("authTokens");
        localStorage.removeItem("userId");
        navigate("/");
    };

    const contextData = {
        loginUser, authTokens, userId, currentUserData, registerUser, logoutUser, BASE_URL
    };

    return (
        <AppContext.Provider value={ contextData }>
            { children }
        </AppContext.Provider>
    )
}