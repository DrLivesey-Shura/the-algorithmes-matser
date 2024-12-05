// best-first-search.ts
export interface GraphEdge {
  node: string;
  cost: number;
}

export interface SearchGraph {
  graph: { [key: string]: GraphEdge[] };
  heuristics: { [key: string]: number };
  start: string;
  goal: string;
}

export interface SearchResult {
  path: string[];
  totalCost: number;
}

export class BestFirstSearchSolver {
  // Parse the input graph JSON
  static parseGraph(graphData: string): SearchGraph {
    try {
      return JSON.parse(graphData);
    } catch (error) {
      throw new Error("Invalid graph JSON format");
    }
  }

  // Best-First Search algorithm
  static bestFirstSearch(graph: SearchGraph): SearchResult | null {
    const { graph: connections, heuristics, start, goal } = graph;

    // Priority queue to store nodes to explore
    const queue: Array<{
      node: string;
      path: string[];
      cost: number;
    }> = [
      {
        node: start,
        path: [start],
        cost: heuristics[start],
      },
    ];

    // Keep track of visited nodes to prevent cycles
    const visited = new Set<string>();

    while (queue.length > 0) {
      // Sort queue based on heuristic value (best first)
      queue.sort((a, b) => heuristics[a.node] - heuristics[b.node]);

      // Get the most promising node
      const currentState = queue.shift()!;
      const { node, path, cost } = currentState;

      // Avoid revisiting nodes
      if (visited.has(node)) continue;
      visited.add(node);

      // Check if goal is found
      if (node === goal) {
        return {
          path: path,
          totalCost: cost,
        };
      }

      // Explore neighboring nodes
      const neighbors = connections[node] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          queue.push({
            node: neighbor.node,
            path: [...path, neighbor.node],
            cost: cost + neighbor.cost + heuristics[neighbor.node],
          });
        }
      }
    }

    // No path found
    return null;
  }

  // Validate input graph structure
  static validateGraph(graph: SearchGraph): boolean {
    // Check if required properties exist
    if (!graph.graph || !graph.heuristics || !graph.start || !graph.goal) {
      return false;
    }

    // Validate that start and goal exist in the graph
    if (!(graph.start in graph.graph) || !(graph.goal in graph.graph)) {
      return false;
    }

    // Check that all nodes in edges exist in the graph
    for (const [node, edges] of Object.entries(graph.graph)) {
      for (const edge of edges) {
        if (!(edge.node in graph.graph)) {
          return false;
        }
      }
    }

    return true;
  }

  // Utility to create a sample graph
  static createSampleGraph(): SearchGraph {
    return {
      graph: {
        A: [
          { node: "B", cost: 1 },
          { node: "C", cost: 2 },
        ],
        B: [
          { node: "D", cost: 4 },
          { node: "E", cost: 1 },
        ],
        C: [
          { node: "F", cost: 5 },
          { node: "G", cost: 6 },
        ],
        D: [],
        E: [{ node: "H", cost: 2 }],
        F: [],
        G: [],
        H: [],
      },
      heuristics: {
        A: 7,
        B: 6,
        C: 4,
        D: 3,
        E: 2,
        F: 6,
        G: 5,
        H: 0,
      },
      start: "A",
      goal: "H",
    };
  }
}
