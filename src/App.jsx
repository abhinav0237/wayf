import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Hometemp";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
