import React, { useState, useEffect, useMemo } from "react";
import { findNearestNode, calculatePath } from "../utils/navigationUtils";
import { NODES } from "../data/graphData";

// Assets
import floor0Img from "../assets/floors/FISAT ground floor plan.png"; 
import floor1Img from "../assets/floors/FISAT first floor plan.png";
import floor2Img from "../assets/floors/FISAT second floor plan.png"; 
import floor3Img from "../assets/floors/FISAT third floor plan.png"; 

export default function FloorMap({ destination, initialStart }) {
  const [userPosition, setUserPosition] = useState(initialStart || null);
  const [activeFloor, setActiveFloor] = useState(0); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <--- State for Hamburger

  const floorImages = { 0: floor0Img, 1: floor1Img, 2: floor2Img, 3: floor3Img };

  // --- 1. Calculate Path & Instructions ---
  const { path, instructions } = useMemo(() => {
    if (!userPosition || !destination?.nodeId) return { path: [], instructions: [] };
    
    const startNodeId = findNearestNode(userPosition);
    const endNodeId = destination.nodeId;
    const calculatedPath = calculatePath(startNodeId, endNodeId);

    const getFriendlyName = (id) => {
      let name = id.replace(/gf_|f1_|f2_|f3_/, '').replace(/[0-9]/g, ''); 
      if (name.includes('st')) return 'STAIRCASE';
      if (name.includes('h')) return 'HALLWAY';
      if (name.includes('p')) return 'TURN';
      return name.replace(/_/g, ' ').toUpperCase();
    };

    const steps = [];
    if (calculatedPath.length > 0) {
      steps.push(`📍 START AT ${getFriendlyName(calculatedPath[0])}`);
      for (let i = 0; i < calculatedPath.length - 1; i++) {
        const curr = NODES[calculatedPath[i]];
        const next = NODES[calculatedPath[i+1]];
        if (curr.floor !== next.floor) {
          const floors = ["GROUND FLOOR", "1ST FLOOR", "2ND FLOOR", "3RD FLOOR"];
          steps.push(`👣 TAKE STAIRCASE TO THE ${floors[next.floor]}`);
        } else if (calculatedPath[i+1].includes('_p')) {
          steps.push(`↪️ TAKE THE TURN`);
        } else if (!calculatedPath[i+1].includes('_h') && !calculatedPath[i+1].includes('_p') && !calculatedPath[i+1].includes('_st')) {
          steps.push(`🚪 ARRIVE AT ${getFriendlyName(calculatedPath[i+1])}`);
        }
      }
      steps.push("✅ YOU HAVE ARRIVED!");
    }

    const uniqueSteps = steps.filter((step, index) => step !== steps[index - 1]);
    return { path: calculatedPath, instructions: uniqueSteps };
  }, [userPosition, destination]);

  useEffect(() => {
    if (initialStart) {
      setUserPosition(initialStart);
      const startNodeId = findNearestNode(initialStart);
      setActiveFloor(NODES[startNodeId]?.floor ?? 0);
    }
  }, [initialStart]);

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setUserPosition({ x, y });
  };

  const getPointsForPolyline = () => {
    if (!path || path.length === 0) return "";
    let points = [];
    if (userPosition && NODES[findNearestNode(userPosition)]?.floor === activeFloor) points.push(`${userPosition.x},${userPosition.y}`);
    path.forEach(id => {
      const node = NODES[id];
      if (node && node.floor === activeFloor) points.push(`${node.x},${node.y}`);
    });
    if (destination && NODES[destination.nodeId]?.floor === activeFloor) points.push(`${destination.x},${destination.y}`);
    return points.join(" ");
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#1a1a1a', display: 'flex', overflow: 'hidden' }}>

      {/* --- HAMBURGER BUTTON --- */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{
          position: 'absolute', top: '20px', left: '20px', zIndex: 2000,
          background: '#007bff', color: 'white', border: 'none', borderRadius: '8px',
          padding: '10px 15px', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}
      >
        {isMenuOpen ? '✕' : '☰ Directions'}
      </button>

      {/* --- INSTRUCTION SIDEBAR (Drawer Mode) --- */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '280px', 
        background: 'rgba(20, 20, 20, 0.95)', 
        backdropFilter: 'blur(15px)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        padding: '80px 20px 20px 20px', // Extra top padding for the button
        overflowY: 'auto',
        zIndex: 1500,
        color: '#fff',
        transition: 'transform 0.3s ease-in-out',
        transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)', // Slips in/out
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#007bff', fontWeight: '800' }}>DIRECTIONS</h3>
        {instructions.map((step, i) => (
          <div key={i} style={{ 
            padding: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', 
            marginBottom: '10px', fontSize: '0.8rem', fontWeight: '600', borderLeft: '3px solid #007bff'
          }}>{step}</div>
        ))}
      </div>

      {/* --- MAIN MAP AREA --- */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* FLOOR SELECTOR (Moved to Right Side for mobile thumb access) */}
        <div style={{ position: 'absolute', right: '20px', top: '20px', zIndex: 1000 }}>
          {[3, 2, 1, 0].map(f => (
            <button key={f} onClick={() => setActiveFloor(f)} style={{
              display: 'block', marginBottom: '10px', width: '45px', height: '45px', borderRadius: '12px',
              background: activeFloor === f ? '#007bff' : '#fff', color: activeFloor === f ? '#fff' : '#000',
              fontWeight: '800', border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>{f === 0 ? 'GF' : `${f}F`}</button>
          ))}
        </div>

        <div onClick={handleMapClick} style={{ position: 'relative', cursor: 'crosshair', maxWidth: '100%' }}>
          <img 
            src={floorImages[activeFloor]} 
            alt="Floor Map" 
            style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: '100vw', maxHeight: '90vh', pointerEvents: 'none' }} 
          />

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
            <polyline points={getPointsForPolyline()} fill="none" stroke="#007bff" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2, 1.5" />
          </svg>

          {/* User Marker */}
          {userPosition && (NODES[findNearestNode(userPosition)]?.floor ?? 0) === activeFloor && (
            <div style={{ position: 'absolute', left: `${userPosition.x}%`, top: `${userPosition.y}%`, width: '12px', height: '12px', background: '#007bff', borderRadius: '50%', border: '2px solid white', transform: 'translate(-50%, -50%)', zIndex: 200 }} />
          )}
          {/* Destination Marker */}
          {destination && (NODES[destination.nodeId]?.floor ?? 0) === activeFloor && (
            <div style={{ position: 'absolute', left: `${destination.x}%`, top: `${destination.y}%`, width: '14px', height: '14px', background: '#ff4757', borderRadius: '50%', border: '2px solid white', transform: 'translate(-50%, -50%)', zIndex: 200 }} />
          )}
        </div>
      </div>
    </div>
  );
}