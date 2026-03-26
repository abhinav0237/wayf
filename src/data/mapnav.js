import React, { useState, useEffect } from 'react';
import { NODES, GRAPH } from './graphData';

// --- 1. DIJKSTRA ALGORITHM ---
const dijkstra = (graph, start, end) => {
  let distances = {};
  let prev = {};
  let pq = new Set(Object.keys(graph));

  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
    prev[node] = null;
  });
  distances[start] = 0;

  while (pq.size > 0) {
    let curr = [...pq].reduce((minNode, node) => 
      distances[node] < distances[minNode] ? node : minNode
    );

    if (curr === end || distances[curr] === Infinity) break;
    pq.delete(curr);

    Object.keys(graph[curr]).forEach(neighbor => {
      let alt = distances[curr] + graph[curr][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = curr;
      }
    });
  }

  let path = [];
  for (let at = end; at !== null; at = prev[at]) path.push(at);
  return path.reverse().includes(start) ? path : [];
};

// --- 2. INSTRUCTION GENERATOR ---
const generateInstructions = (path, nodes) => {
  if (!path || path.length < 2) return ["Select a destination to see directions."];

  const steps = [];
  const getFriendlyName = (id) => {
    // Removes floor prefixes and underscores for readability
    return id.replace(/gf_|f1_|f2_|f3_/, '').replace(/_/g, ' ').toUpperCase();
  };

  steps.push(`📍 Start at ${getFriendlyName(path[0])}`);

  for (let i = 0; i < path.length - 1; i++) {
    const current = nodes[path[i]];
    const next = nodes[path[i + 1]];

    // Detect Floor Change
    if (current.floor !== next.floor) {
      const stairLabel = path[i].includes('st') ? getFriendlyName(path[i]) : "the stairs";
      const targetFloor = next.floor === 0 ? "Ground Floor" : `${next.floor}${next.floor === 1 ? 'st' : next.floor === 2 ? 'nd' : 'rd'} Floor`;
      steps.push(`👣 Take ${stairLabel} to the ${targetFloor}`);
    } 
    // Detect arriving at a major room (not a hallway or path node)
    else if (!path[i+1].includes('_h') && !path[i+1].includes('_p') && !path[i+1].includes('_st')) {
      steps.push(`🚪 Enter ${getFriendlyName(path[i+1])}`);
    }
  }

  steps.push("✅ You have arrived!");
  return [...new Set(steps)]; // Remove duplicate consecutive instructions
};

// --- 3. MAIN COMPONENT ---
export default function MapNavigation() {
  const [startNode, setStartNode] = useState('gf_st3'); // Default start
  const [endNode, setEndNode] = useState('');
  const [path, setPath] = useState([]);
  const [instructions, setInstructions] = useState([]);

  // Update path and instructions whenever start or end changes
  useEffect(() => {
    if (startNode && endNode) {
      const p = dijkstra(GRAPH, startNode, endNode);
      setPath(p);
      setInstructions(generateInstructions(p, NODES));
    }
  }, [startNode, endNode]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', color: '#333' }}>
      
      {/* Sidebar for Instructions */}
      <div style={{ width: '350px', backgroundColor: '#f4f4f9', padding: '20px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
        <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Directions</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Destination:</label>
          <select 
            onChange={(e) => setEndNode(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="">Select a Room...</option>
            <option value="idealab">Idea Lab (F1)</option>
            <option value="staffroom">Staff Room (F2)</option>
            <option value="cfslab">CFS Lab (F3)</option>
            <option value="seminar">Seminar Hall (GF)</option>
            <option value="fablab">FabLab (GF)</option>
          </select>
        </div>

        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {instructions.map((step, index) => (
            <li key={index} style={{ 
              padding: '12px', 
              backgroundColor: index === 0 ? '#e3f2fd' : 'white', 
              marginBottom: '10px', 
              borderRadius: '8px',
              borderLeft: index === 0 ? '5px solid #2196f3' : '5px solid #90caf9',
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Map Area */}
      <div style={{ flexGrow: 1, position: 'relative', backgroundColor: '#fff' }}>
        <h3 style={{ position: 'absolute', top: 10, left: 20 }}>Interactive Map View</h3>
        
        {/* Your existing SVG Map Rendering Logic goes here */}
        <svg width="100%" height="100%" viewBox="0 0 100 100">
           {/* Path Line Rendering */}
           {path.length > 1 && (
             <polyline
               points={path.map(p => `${NODES[p].x},${NODES[p].y}`).join(' ')}
               fill="none"
               stroke="#2196f3"
               strokeWidth="0.8"
               strokeDasharray="2,1"
             />
           )}
           {/* Nodes Rendering */}
           {path.map(nodeId => (
             <circle 
                key={nodeId} 
                cx={NODES[nodeId].x} 
                cy={NODES[nodeId].y} 
                r="0.5" 
                fill="#2196f3" 
             />
           ))}
        </svg>
      </div>
    </div>
  );
}