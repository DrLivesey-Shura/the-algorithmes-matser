"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { aStarPathfinding, generateRandomGrid, GridNode } from "./a-star";

export default function AStarPathfindingPage() {
  const [gridSize, setGridSize] = useState(10);
  const [wallProbability, setWallProbability] = useState(0.3);
  const [grid, setGrid] = useState<GridNode[][]>([]);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [goal, setGoal] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const [explored, setExplored] = useState<{ x: number; y: number }[]>([]);
  const [mode, setMode] = useState<"generate" | "start" | "goal">("generate");

  // Regenerate grid when size or wall probability changes
  useEffect(() => {
    const newGrid = generateRandomGrid(gridSize, gridSize, wallProbability);
    setGrid(newGrid);

    // Reset start and goal
    setStart({ x: 0, y: 0 });
    setGoal({ x: gridSize - 1, y: gridSize - 1 });

    // Clear previous path
    setPath([]);
    setExplored([]);
  }, [gridSize, wallProbability]);

  // Find path when grid changes
  const findPath = () => {
    // Ensure start and goal are not walls
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    newGrid[start.y][start.x].isWall = false;
    newGrid[goal.y][goal.x].isWall = false;

    const result = aStarPathfinding(newGrid, start, goal);
    setPath(result.path);
    setExplored(result.explored);
  };

  // Handle cell click based on current mode
  const handleCellClick = (x: number, y: number) => {
    switch (mode) {
      case "start":
        setStart({ x, y });
        setMode("goal");
        break;
      case "goal":
        setGoal({ x, y });
        setMode("generate");
        break;
      case "generate":
        // Toggle wall
        const newGrid = [...grid];
        newGrid[y][x] = {
          ...newGrid[y][x],
          isWall: !newGrid[y][x].isWall,
        };
        setGrid(newGrid);
        break;
    }
  };

  // Render cell with appropriate classes
  const renderCell = (cell: GridNode, x: number, y: number) => {
    let className = "w-8 h-8 border border-gray-300";

    if (cell.isWall) {
      className += " bg-gray-500";
    }

    if (start.x === x && start.y === y) {
      className += " bg-green-500";
    }

    if (goal.x === x && goal.y === y) {
      className += " bg-red-500";
    }

    if (explored.some((p) => p.x === x && p.y === y)) {
      className += " bg-blue-100";
    }

    if (path.some((p) => p.x === x && p.y === y)) {
      className += " bg-purple-500";
    }

    return className;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Link
          href="/"
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          ← Back to Algorithms
        </Link>
        <h1 className="text-2xl font-bold text-center">
          A* Pathfinding Visualization
        </h1>
        <div></div>
      </div>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="block mb-2">Grid Size</label>
          <input
            type="number"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            min="5"
            max="20"
            className="w-20 p-1 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Wall Probability</label>
          <input
            type="number"
            value={wallProbability}
            onChange={(e) => setWallProbability(Number(e.target.value))}
            min="0"
            max="1"
            step="0.1"
            className="w-20 p-1 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Mode</label>
          <select
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as "generate" | "start" | "goal")
            }
            className="p-1 border rounded"
          >
            <option value="generate">Toggle Walls</option>
            <option value="start">Set Start</option>
            <option value="goal">Set Goal</option>
          </select>
        </div>
        <button
          onClick={findPath}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Find Path
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <button
                key={`${x}-${y}`}
                className={renderCell(cell, x, y)}
                onClick={() => handleCellClick(x, y)}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="list-disc list-inside">
          <li>A* finds the shortest path between two points</li>
          <li>Uses a best-first search algorithm with a heuristic</li>
          <li>Green: Start point, Red: Goal point</li>
          <li>Blue cells: Explored nodes, Purple: Final path</li>
          <li>Click to toggle walls or set start/goal points</li>
        </ul>
      </div>
    </div>
  );
}
