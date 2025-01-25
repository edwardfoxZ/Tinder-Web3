// index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Register } from "./components/Register";
import { NotFoundP } from "./utils/NotFoundP";
import { LogIn } from "./components/LogIn";
import { Web3Provider } from "./context/Web3Context";
import { Profile } from "./pages/Profile";

const root = ReactDOM.createRoot(document.getElementById("root"));

const RouterWithWeb3 = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="/" element={<LogIn />} />
        <Route path="/:userAddress-profile" element={<Profile />} />
        <Route path="/Sign-up" element={<Register />} />
        <Route path="*" element={<NotFoundP />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

root.render(
  <React.StrictMode>
    <Web3Provider>
      <RouterWithWeb3 />
    </Web3Provider>
  </React.StrictMode>
);
