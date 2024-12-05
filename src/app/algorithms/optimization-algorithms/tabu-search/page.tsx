// page.tsx
"use client";

import React, { useState } from "react";
import { TabuSearch, NeighborGenerators } from "./tabu-search";

export default function TabuSearchDemo() {
  const [objectiveFunction, setObjectiveFunction] = useState(
    "x[0] * Math.sin(x[0]) + x[1] * Math.cos(x[1])"
  );
  const [initialSolution, setInitialSolution] = useState("0,0");
  const [maxIterations, setMaxIterations] = useState(100);
  const [tabuListSize, setTabuListSize] = useState(10);
  const [neighborhoodSize, setNeighborhoodSize] = useState(20);
  const [neighborMethod, setNeighborMethod] = useState("continuousRandomWalk");

  const [results, setResults] = useState<{
    bestSolution: number[];
    bestObjectiveValue: number;
    iterationsPerformed: number;
  } | null>(null);
  const [runningAlgorithm, setRunningAlgorithm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTabuSearch = () => {
    setError(null);
    setRunningAlgorithm(true);

    try {
      // Parse initial solution
      const initialSolutionArray = initialSolution.split(",").map(Number);

      // Create objective function
      const objectiveFuncBody = new Function(
        "x",
        `return ${objectiveFunction}`
      );
      const objectiveFunc = (solution: number[]) => objectiveFuncBody(solution);

      // Select neighbor generator
      const neighborGenerator =
        NeighborGenerators[neighborMethod as keyof typeof NeighborGenerators];
      if (!neighborGenerator) {
        throw new Error("Invalid neighbor generation method");
      }

      // Use setTimeout to prevent UI freezing
      setTimeout(() => {
        const tabuSearch = new TabuSearch(
          initialSolutionArray,
          objectiveFunc,
          neighborGenerator,
          {
            maxIterations,
            tabuListSize,
            neighborhoodSize,
          }
        );

        const searchResults = tabuSearch.search();

        setResults(searchResults);
        setRunningAlgorithm(false);
      }, 100);
    } catch (err) {
      setError((err as Error).message);
      setRunningAlgorithm(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Tabu Search Optimizer
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">
              Objective Function (use x as array)
            </label>
            <input
              type="text"
              value={objectiveFunction}
              onChange={(e) => setObjectiveFunction(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., x[0] * Math.sin(x[0]) + x[1] * Math.cos(x[1])"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Initial Solution (comma-separated)
            </label>
            <input
              type="text"
              value={initialSolution}
              onChange={(e) => setInitialSolution(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., 0,0"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Neighbor Generation Method
            </label>
            <select
              value={neighborMethod}
              onChange={(e) => setNeighborMethod(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="continuousRandomWalk">
                Continuous Random Walk
              </option>
              <option value="permutationSwap">Permutation Swap</option>
              <option value="binaryFlip">Binary Flip</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Max Iterations</label>
              <input
                type="number"
                value={maxIterations}
                onChange={(e) => setMaxIterations(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Tabu List Size</label>
              <input
                type="number"
                value={tabuListSize}
                onChange={(e) => setTabuListSize(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Neighborhood Size
            </label>
            <input
              type="number"
              value={neighborhoodSize}
              onChange={(e) => setNeighborhoodSize(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <button
            onClick={runTabuSearch}
            disabled={runningAlgorithm}
            className={`w-full px-6 py-3 rounded ${
              runningAlgorithm
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {runningAlgorithm ? "Running..." : "Run Tabu Search"}
          </button>
        </div>

        {results && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <p>
              Best Solution:{" "}
              {results.bestSolution.map((x) => x.toFixed(4)).join(", ")}
            </p>
            <p>Best Objective Value: {results.bestObjectiveValue.toFixed(4)}</p>
            <p>Iterations Performed: {results.iterationsPerformed}</p>
          </div>
        )}
      </div>
    </div>
  );
}
