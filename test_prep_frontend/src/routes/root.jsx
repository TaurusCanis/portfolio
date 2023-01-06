import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useLoaderData, useOutlet } from "react-router-dom";
import { AppProvider } from "../AppContext";

export default function Root() {
    const outlet = useOutlet();

    return (
        <AppProvider>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </AppProvider>
    );
}