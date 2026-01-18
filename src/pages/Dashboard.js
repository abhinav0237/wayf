import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Building2,
  ChevronRight,
  LogOut,
} from "lucide-react";

const DESTINATIONS = [
  { id: 1, name: "Main Seminar Hall", floor: "1st Floor", tag: "Meeting" },
  { id: 2, name: "Placement Cell", floor: "Ground Floor", tag: "Meeting" },
  { id: 3, name: "Fab Lab", floor: "1st Floor", tag: "Lab" },
  { id: 4, name: "Vending Machine", floor: "2nd Floor", tag: "Food" },
  { id: 5, name: "Principal's Office", floor: "1st Floor", tag: "Office" },
  { id: 6, name: "Office", floor: "1st Floor", tag: "Office" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (!storedName) {
      navigate("/");
    } else {
      setName(storedName);
    }
  }, [navigate]);

  const filtered = DESTINATIONS.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <>
      {/* HEADER */}
      <div className="top-bar">
        <div className="top-left">
          <div className="logo-circle">!</div>
          <div>
            <strong>Wayfinder</strong>
            <p className="welcome-text">Welcome, {name}</p>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard">
        <h2 className="title">Where would you like to go?</h2>

        {/* Search */}
        <div className="search-box">
          <Search className="search-icon" />
          <input
            placeholder="Search destinations..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
          />
        </div>

        {/* Suggestions */}
        {query && (
          <div className="suggestions">
            {filtered.length === 0 && (
              <div className="no-result">No destinations found</div>
            )}

            {filtered.map((d) => (
              <div
                key={d.id}
                className="suggestion-item"
                onClick={() => {
                  setSelected(d);
                  setQuery(d.name);
                }}
              >
                <MapPin />
                <div>
                  <strong>{d.name}</strong>
                  <p>{d.floor}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected card */}
        {selected && (
          <div className="selected-card">
            <div className="selected-header">
              <div className="icon-box">
                <MapPin />
              </div>

              <div>
                <h3>{selected.name}</h3>
                <p className="floor">
                  <Building2 size={14} />
                  {selected.floor}
                </p>
                <span className="badge">{selected.tag}</span>
              </div>
            </div>

            <button className="start-btn">
              <span className="start-left">
                <MapPin size={16} />
                Start Navigation
              </span>
              <ChevronRight />
            </button>
          </div>
        )}

        {/* Popular */}
        <h3 className="section-title">Popular Destinations</h3>

        <div className="grid">
          {DESTINATIONS.map((d) => (
            <div
              key={d.id}
              className="grid-card"
              onClick={() => setSelected(d)}
            >
              <div className="grid-icon">
                <MapPin />
              </div>
              <strong>{d.name}</strong>
              <p>{d.floor}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
