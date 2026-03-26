import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DESTINATIONS } from "../data/destinations";
import { NODES } from "../data/graphData"; 
import QRScanner from "../components/QRScanner"; 
import { Search, MapPin, Building2, ChevronRight, LogOut, QrCode, CheckCircle2, LocateFixed } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [startLocation, setStartLocation] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

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

  const handleQRScan = (decodedText) => {
    // 1. Normalize the ID: If they scan "h1", turn it into "gf_h1"
    // If they scan "office", keep it as "office"
    let targetId = decodedText;
    
    if (targetId.startsWith('h') && !targetId.startsWith('gf_')) {
      targetId = `gf_${targetId}`;
    }

    // 2. Look it up in your NODES
    const node = NODES[targetId];

    if (node) {
      // success!
      setStartLocation({ ...node, id: targetId });
      setShowScanner(false);
    } else {
      // fallback: if gf_h1 fails, show the error
      alert(`Location "${decodedText}" not found on map.`);
      console.error("Scanner looked for:", targetId, "but it's missing in NODES");
    }
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
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="dashboard">
        {/* --- SECTION 1: USER LOCATION --- */}
        <h3 className="section-title">Your Location</h3>
        
        <div 
          className={`grid-card qr-feature-card ${startLocation ? 'active' : ''}`} 
          onClick={() => setShowScanner(true)}
          style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            textAlign: 'left',
            gap: '16px',
            marginBottom: '24px',
            border: startLocation ? '2px solid #2ed573' : '1px solid #eee'
          }}
        >
          <div className="grid-icon" style={{ margin: 0, backgroundColor: startLocation ? '#e3faf0' : '#f0f7ff' }}>
            {startLocation ? <CheckCircle2 size={24} color="#2ed573" /> : <QrCode size={24} color="#1e90ff" />}
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '1.1rem' }}>
              {startLocation ? `Position: ${startLocation.id}` : "Locate Yourself"}
            </strong>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
              {startLocation ? "Start point is set. Choose a destination!" : "Scan the nearest QR pillar to begin"}
            </p>
          </div>
          {startLocation ? (
            <span style={{ color: '#2ed573', fontWeight: 'bold', fontSize: '0.8rem' }}>CHANGE</span>
          ) : (
            <ChevronRight size={20} color="#ccc" />
          )}
        </div>

        {/* QR SCANNER MODAL */}
        {showScanner && (
          <div className="qr-modal-overlay">
            <div className="qr-modal-content">
              <h3>Scan Location QR</h3>
              <QRScanner onScanSuccess={handleQRScan} />
              <button className="cancel-btn" onClick={() => setShowScanner(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* --- SECTION 2: SEARCH & DESTINATIONS --- */}
        <h2 className="title">Where would you like to go?</h2>

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
            {filtered.map((d) => (
              <div key={d.id} className="suggestion-item" onClick={() => { setSelected(d); setQuery(d.name); }}>
                <MapPin />
                <div><strong>{d.name}</strong><p>{d.floor}</p></div>
              </div>
            ))}
          </div>
        )}

        {/* Selected card */}
        {selected && (
          <div className="selected-card">
            <div className="selected-header">
              <div className="icon-box"><MapPin /></div>
              <div>
                <h3>{selected.name}</h3>
                <p className="floor"><Building2 size={14} />{selected.floor}</p>
                <span className="badge">{selected.tag}</span>
              </div>
            </div>

            <button 
              className="start-btn" 
              onClick={() => navigate("/map", { 
                state: { destination: selected, initialStart: startLocation } 
              })}
              disabled={!startLocation}
              style={{ opacity: startLocation ? 1 : 0.6 }}
            >
              <span className="start-left">
                <MapPin size={16} /> 
                {startLocation ? "Start Navigation" : "Scan QR First to Start"}
              </span>
              <ChevronRight />
            </button>
          </div>
        )}

        {/* Popular Grid */}
        <h3 className="section-title">Popular Destinations</h3>
        <div className="grid">
          {DESTINATIONS.map((d) => (
            <div key={d.id} className="grid-card" onClick={() => setSelected(d)}>
              <div className="grid-icon"><MapPin /></div>
              <strong>{d.name}</strong>
              <p>{d.floor}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}