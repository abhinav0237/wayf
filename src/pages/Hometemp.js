import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name.trim()) return;
    localStorage.setItem("username", name);
    navigate("/dashboard");
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Wayfinder</h1>
        <p className="subtitle">
        </p>

        <input
          type="text"
          placeholder="Enter your name"
          className="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
        />

        <button className="start-btn-home" onClick={handleStart}>
          Start Navigating
        </button>

        <p className="footer-text">
          Every Turn Matters
        </p>
      </div>
    </div>
  );
}
