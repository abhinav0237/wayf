import { useState } from "react";
import floor1 from "../assets/floors/floor1.jpeg";

export default function CoordHelper() {
  const [nodes, setNodes] = useState([]);

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = parseFloat(((e.clientX - rect.left) / rect.width) * 100).toFixed(2);
    const y = parseFloat(((e.clientY - rect.top) / rect.height) * 100).toFixed(2);

    const newNode = { id: `node_${nodes.length + 1}`, x, y };
    
    // 1. Log it so you can copy/paste it later
    console.log(`{ id: "node_${nodes.length + 1}", x: ${x}, y: ${y} },`);
    
    setNodes([...nodes, newNode]);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Map Node Creator</h2>
      <p>Click on corners, intersections, and doors. Check your Console (F12) for the data!</p>
      
      <div className="map-wrapper" onClick={handleMapClick} style={{ cursor: 'crosshair' }}>
        <img src={floor1} alt="Floor Map" className="map-image" />
        
        {nodes.map((node) => (
          <div
            key={node.id}
            className="marker node-marker"
            style={{ 
              left: `${node.x}%`, 
              top: `${node.y}%`, 
              position: 'absolute',
              background: 'green',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <span style={{ fontSize: '10px', position: 'absolute', top: '12px', whiteSpace: 'nowrap' }}>
              {node.id}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setNodes([])}>Clear Nodes</button>
      </div>
    </div>
  );
}