const getDist = (n1, n2) => {
  if (!n1 || !n2) return 0;
  return Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
};

export const NODES = {
  // --- GROUND FLOOR ---
  gf_h1: { x: 19.13, y: 51.61, floor: 0 }, gf_h2: { x: 40.29, y: 51.61, floor: 0 },
  gf_h3: { x: 48.10, y: 51.61, floor: 0 }, gf_h4: { x: 65.16, y: 51.61, floor: 0 },
  gf_h5: { x: 80.85, y: 51.61, floor: 0 }, gf_h6: { x: 19.13, y: 62.55, floor: 0 },
  gf_h7: { x: 65.16, y: 62.55, floor: 0 }, gf_h8: { x: 80.85, y: 62.55, floor: 0 },
  seminar: { x: 32.16, y: 50.11, floor: 0 }, principal: { x: 51.80, y: 49.57, floor: 0 },
  office: { x: 57.19, y: 50.11, floor: 0 }, fablab: { x: 71.35, y: 63.52, floor: 0 },
  gf_p9: { x: 40.29, y: 62.55, floor: 0 }, gf_p10: { x: 48.10, y: 62.55, floor: 0 },
  gf_st3: { x: 20.17, y: 50.11, floor: 0 }, gf_st5: { x: 50.03, y: 53.00, floor: 0 },
  gf_st11: { x: 62.50, y: 63.20, floor: 0 },

  // --- FIRST FLOOR ---
  f1_h1: { x: 48.10, y: 51.61, floor: 1 }, f1_h2: { x: 65.16, y: 51.61, floor: 1 },
  f1_h3: { x: 80.85, y: 51.61, floor: 1 }, f1_h4: { x: 19.13, y: 62.55, floor: 1 },
  f1_h5: { x: 40.29, y: 62.55, floor: 1 }, f1_h6: { x: 48.10, y: 62.55, floor: 1 },
  f1_h7: { x: 65.16, y: 62.55, floor: 1 }, f1_h8: { x: 80.85, y: 62.55, floor: 1 },
  idealab: { x: 62.74, y: 52.04, floor: 1 },
  f1_st3: { x: 20.17, y: 50.11, floor: 1 }, f1_st5: { x: 50.03, y: 53.00, floor: 1 },
  f1_st11: { x: 62.50, y: 63.20, floor: 1 },

  // --- SECOND FLOOR ---
  f2_h1: { x: 19.13, y: 62.55, floor: 2 }, f2_h2: { x: 40.29, y: 62.55, floor: 2 },
  f2_h3: { x: 48.10, y: 62.55, floor: 2 }, f2_h4: { x: 65.16, y: 62.55, floor: 2 },
  f2_h5: { x: 80.85, y: 62.55, floor: 2 },
  // Path Turn Nodes for Second Floor
  f2_p5: { x: 80.85, y: 39.81, floor: 2 },
  f2_p6: { x: 80.85, y: 62.55, floor: 2 },
  f2_p7: { x: 95.33, y: 62.55, floor: 2 },
  f2_p8: { x: 95.33, y: 39.81, floor: 2 },
  staffroom: { x: 94.13, y: 38.09, floor: 2 },
  f2_st3: { x: 20.17, y: 50.11, floor: 2 }, f2_st9: { x: 62.50, y: 63.20, floor: 2 },

  // --- THIRD FLOOR ---
  f3_h1: { x: 19.13, y: 62.55, floor: 3 }, f3_h2: { x: 40.29, y: 62.55, floor: 3 },
  f3_h3: { x: 48.10, y: 62.55, floor: 3 }, f3_h4: { x: 65.16, y: 62.55, floor: 3 },
  f3_h5: { x: 80.85, y: 62.55, floor: 3 },
  cfslab: { x: 58.23, y: 62.34, floor: 3 },
  f3_st3: { x: 62.50, y: 63.20, floor: 3 },
};

export const EDGES = {
  // --- GROUND FLOOR ---
  gf_h1: ["gf_h2", "gf_h6", "gf_st3"],
  gf_h2: ["gf_h1", "gf_h3", "seminar", "gf_p9"],
  gf_h3: ["gf_h2", "gf_h4", "principal", "gf_st5"],
  gf_h4: ["gf_h3", "gf_h5", "office", "gf_h7"],
  gf_h5: ["gf_h4", "gf_h8"],
  gf_h6: ["gf_h1", "gf_p9"],
  gf_h7: ["gf_h4", "gf_h8", "fablab", "gf_st11", "gf_p10"],
  gf_h8: ["gf_h5", "gf_h7"],
  gf_p9: ["gf_h6", "gf_h2"], 
  gf_p10: ["gf_h7", "gf_h3"],
  seminar: ["gf_h2"], principal: ["gf_h3"], office: ["gf_h4"], fablab: ["gf_h7"],

  // --- FIRST FLOOR ---
  f1_h1: ["f1_h2", "f1_h6", "f1_st5"],
  f1_h2: ["f1_h1", "f1_h3", "idealab", "f1_h7"],
  f1_h3: ["f1_h2", "f1_h8"],
  f1_h4: ["f1_h5", "f1_st3"],
  f1_h5: ["f1_h4", "f1_h6"],
  f1_h6: ["f1_h5", "f1_h1"],
  f1_h7: ["f1_h2", "f1_h8", "f1_st11"],
  f1_h8: ["f1_h7", "f1_h3"],
  idealab: ["f1_h2"],

  // --- SECOND FLOOR (Turn Node Integration) ---
  f2_h1: ["f2_h2", "f2_st3"],
  f2_h2: ["f2_h1", "f2_h3"],
  f2_h3: ["f2_h2", "f2_h4"],
  f2_h4: ["f2_h3", "f2_h5", "f2_st9"],
  // Forced path: h5 -> p6 -> p7 -> p8 -> Staff Room
  f2_h5: ["f2_h4", "f2_p6"],
  f2_p6: ["f2_h5", "f2_p7", "f2_p5"],
  f2_p7: ["f2_p6", "f2_p8"],
  f2_p8: ["f2_p7", "f2_p5", "staffroom"],
  f2_p5: ["f2_p6", "f2_p8"],
  staffroom: ["f2_p8"],

  // --- THIRD FLOOR ---
  f3_h1: ["f3_h2"],
  f3_h2: ["f3_h1", "f3_h3"],
  f3_h3: ["f3_h2", "f3_h4"],
  f3_h4: ["f3_h3", "f3_h5", "cfslab", "f3_st3"],
  f3_h5: ["f3_h4"],
  cfslab: ["f3_h4"],

  // --- STAIRS (Vertical Bridges) ---
  gf_st3: ["f1_st3", "gf_h1"],
  f1_st3: ["gf_st3", "f2_st3", "f1_h4"],
  f2_st3: ["f1_st3", "f2_h1"],
  gf_st5: ["f1_st5", "gf_h3"],
  f1_st5: ["gf_st5", "f1_h1"],
  gf_st11: ["f1_st11", "gf_h7"],
  f1_st11: ["gf_st11", "f2_st9", "f1_h7"],
  f2_st9: ["f1_st11", "f3_st3", "f2_h4"],
  f3_st3: ["f2_st9", "f3_h4"]
};

// Automated Bidirectional Cleanup
const finalGraph = {};
Object.keys(EDGES).forEach(startNode => {
  if (!finalGraph[startNode]) finalGraph[startNode] = {};
  EDGES[startNode].forEach(endNode => {
    if (NODES[startNode] && NODES[endNode]) {
      const d = getDist(NODES[startNode], NODES[endNode]);
      finalGraph[startNode][endNode] = d;
      if (!finalGraph[endNode]) finalGraph[endNode] = {};
      finalGraph[endNode][startNode] = d;
    }
  });
});

export const GRAPH = finalGraph;