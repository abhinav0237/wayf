import { NODES, GRAPH } from "../data/graphData";

export function findNearestNode(point) {
  if (!point) return null;
  let nearest = null;
  let minPrevDist = Infinity;

  Object.entries(NODES).forEach(([id, node]) => {
    // Only look for nodes on the current floor
    const dist = Math.sqrt(Math.pow(point.x - node.x, 2) + Math.pow(point.y - node.y, 2));
    if (dist < minPrevDist) {
      minPrevDist = dist;
      nearest = id;
    }
  });
  return nearest;
}

export function calculatePath(startId, endId) {
  if (!startId || !endId || !GRAPH[startId] || !GRAPH[endId]) return [];
  if (startId === endId) return [startId];

  const distances = {};
  const prev = {};
  const pq = new Set(Object.keys(GRAPH));

  Object.keys(GRAPH).forEach(node => {
    distances[node] = Infinity;
    prev[node] = null;
  });
  distances[startId] = 0;

  while (pq.size > 0) {
    let currNode = null;
    pq.forEach(node => {
      if (!currNode || distances[node] < distances[currNode]) currNode = node;
    });

    if (distances[currNode] === Infinity || currNode === endId) break;
    pq.delete(currNode);

    Object.entries(GRAPH[currNode]).forEach(([neighbor, weight]) => {
      const alt = distances[currNode] + weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = currNode;
      }
    });
  }

  const path = [];
  let curr = endId;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }
  return path[0] === startId ? path : [];
}