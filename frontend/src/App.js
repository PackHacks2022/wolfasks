import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from './Home';
import Login from './Login';
import io from "socket.io-client";
import Dashboard from "./Dashboard";
import Session from "./Session";

// Primary component, in charge of defining routes to other components
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/session" element={<Session />} />
      </Routes>
    </div>
  )
}

export default App;