import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router components
import Home from "./Pages/Home";
import List from "./Pages/List";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capsule-list" element={<List />} />
      </Routes>
    </Router>
  );
}

export default App;