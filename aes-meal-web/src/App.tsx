import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Registration />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
