import logo from './logo.svg';
import './App.css';
import SearchPage from "./SearchPage";
import "./styles.css";
import { AppProvider } from './AppContext';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <SearchPage />
      </div>
    </AppProvider>
  );
}

export default App;
