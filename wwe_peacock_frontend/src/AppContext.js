import { createContext } from "react";

export const AppContext = createContext();

export const AppProvider =({ children }) => {
    const PRODUCTION = true;
    const BASE_URL = PRODUCTION ? "https://andrewdole.com/wwe-peacock-api/": "http://127.0.0.1:8000/wwe-peacock-api/";

    return (
        <AppContext.Provider value={{ BASE_URL }}>
            { children }
        </AppContext.Provider>
    );
}


