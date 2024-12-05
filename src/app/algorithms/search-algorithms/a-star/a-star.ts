// Priority queue implementation for efficient node management
class PriorityQueue<T> {
  private elements: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.elements.shift()?.element;
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
}

// Type definitions for the grid and node
export interface GridNode {
  x: number;
  y: number;
  isWall: boolean;
}

interface AStarNode extends GridNode {
  g: number; // Cost from start node
  h: number; // Heuristic estimated cost to goal
  f: number; // Total estimated cost (g + h)
  parent: AStarNode | null;
}

// A* Pathfinding Algorithm
export function aStarPathfinding(
  grid: GridNode[][],
  start: { x: number; y: number },
  goal: { x: number; y: number }
): { path: { x: number; y: number }[]; explored: { x: number; y: number }[] } {
  const rows = grid.length;
  const cols = grid[0].length;

  // Helper function to create a node
  const createNode = (x: number, y: number): AStarNode => ({
    x,
    y,
    isWall: grid[y][x].isWall,
    g: Infinity,
    h: 0,
    f: Infinity,
    parent: null,
  });

  // Create nodes for start and goal
  const startNode = createNode(start.x, start.y);
  const goalNode = createNode(goal.x, goal.y);

  // Heuristic function (Manhattan distance)
  const heuristic = (node: AStarNode) =>
    Math.abs(node.x - goalNode.x) + Math.abs(node.y - goalNode.y);

  // Check if a node is valid and walkable
  const isValidNode = (node: AStarNode) =>
    node.x >= 0 &&
    node.x < cols &&
    node.y >= 0 &&
    node.y < rows &&
    !node.isWall;

  // Get neighboring nodes
  const getNeighbors = (node: AStarNode): AStarNode[] => {
    const neighbors: AStarNode[] = [];
    const directions = [
      { x: 0, y: 1 }, // Down
      { x: 0, y: -1 }, // Up
      { x: 1, y: 0 }, // Right
      { x: -1, y: 0 }, // Left
    ];

    for (const dir of directions) {
      const newX = node.x + dir.x;
      const newY = node.y + dir.y;

      if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        const neighborNode = createNode(newX, newY);
        if (!neighborNode.isWall) {
          neighbors.push(neighborNode);
        }
      }
    }

    return neighbors;
  };

  // Initialize data structures
  const openSet = new PriorityQueue<AStarNode>();
  const closedSet = new Set<string>();
  const exploredNodes: { x: number; y: number }[] = [];

  // Setup start node
  startNode.g = 0;
  startNode.h = heuristic(startNode);
  startNode.f = startNode.h;
  openSet.enqueue(startNode, startNode.f);

  while (!openSet.isEmpty()) {
    // Get the node with lowest f score
    const currentNode = openSet.dequeue()!;

    // Check if we've reached the goal
    if (currentNode.x === goalNode.x && currentNode.y === goalNode.y) {
      // Reconstruct path
      const path: { x: number; y: number }[] = [];
      let current: AStarNode | null = currentNode;
      while (current) {
        path.unshift({ x: current.x, y: current.y });
        current = current.parent;
      }

      return { path, explored: exploredNodes };
    }

    // Mark current node as closed
    closedSet.add(`${currentNode.x},${currentNode.y}`);
    exploredNodes.push({ x: currentNode.x, y: currentNode.y });

    // Check neighbors
    const neighbors = getNeighbors(currentNode);
    for (const neighbor of neighbors) {
      // Skip if already evaluated
      if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

      // Calculate tentative g score
      const tentativeG = currentNode.g + 1;

      // If this path is better or the neighbor is not in open set
      if (tentativeG < neighbor.g) {
        neighbor.parent = currentNode;
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor);
        neighbor.f = neighbor.g + neighbor.h;

        // Add to open set if not already there
        openSet.enqueue(neighbor, neighbor.f);
      }
    }
  }

  // No path found
  return { path: [], explored: exploredNodes };
}

// Example grid generation function
export function generateRandomGrid(
  rows: number,
  cols: number,
  wallProbability: number = 0.3
): GridNode[][] {
  const grid: GridNode[][] = [];

  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = {
        x,
        y,
        isWall: Math.random() < wallProbability,
      };
    }
  }

  return grid;
}

// Demonstration function
export function demonstrateAStarPathfinding() {
  const rows = 10;
  const cols = 10;
  const grid = generateRandomGrid(rows, cols);

  // Ensure start and goal are not walls
  const start = { x: 0, y: 0 };
  const goal = { x: cols - 1, y: rows - 1 };
  grid[start.y][start.x].isWall = false;
  grid[goal.y][goal.x].isWall = false;

  const result = aStarPathfinding(grid, start, goal);

  console.log("Path found:", result.path);
  console.log("Nodes explored:", result.explored);

  return result;
}
