import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles.css';
import './styles2.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import TestsList from './routes/tests-list';
import TestsDetail from "./routes/test-detail.jsx"
import Home from './routes/Home';
import Dashboard from './routes/Dashboard';
import TestContainer from './routes/TestContainer';
import { MathJaxContext } from 'better-react-mathjax';
import { AppProvider } from './AppContext';
import Results from './routes/results';
import Login from "./routes/Login";
import Signup from "./routes/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "dashboard/",
        element: <Dashboard />,
      },
      {
        path: "tests/",
        element: <TestsList />,
      },
      {
        path: "tests/:testId",
        element: <TestsDetail />,
      },
      {
        path: "tests/:testId/questions/:sectionName",
        element: <TestContainer />,
      },
      {
        path: "tests/:testId/results",
        element: <Results />,
      },
      {
        path: "login/",
        element: <Login />,
      },
      {
        path: "signup/",
        element: <Signup />,
      },
    ]
  },
],
  {
    basename: "/testprep"
  }
,);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MathJaxContext>
    <React.StrictMode>
      
        {/* <App /> */}
        <RouterProvider router={router}>
          <AppProvider />
        </RouterProvider>
    </React.StrictMode>
  </MathJaxContext>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
