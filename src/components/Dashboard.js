import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Sector from "./Sector";
import Temporal from "./Temporal";
import Impact from "./Impact";
import Geographical from "./Geographical";
const Dashboard = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="mainContent">
        <Routes>
          <Route>
            <Route path="/" element={<Home />} />
            <Route path="/Sector" element={<Sector />} />
            <Route path="/Temporal" element={<Temporal />} />
            <Route path="/Impact" element={<Impact />} />
            <Route path="/Geographical" element={<Geographical />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Dashboard;
