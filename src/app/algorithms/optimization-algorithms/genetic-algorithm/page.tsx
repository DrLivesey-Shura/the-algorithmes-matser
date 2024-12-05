// page.tsx
"use client";

import React, { useState } from "react";
import { GeneticAlgorithm } from "./genetic-algorithm";

export default function GeneticAlgorithmDemo() {
  const [functionInput, setFunctionInput] = useState("x * Math.sin(x)");
  const [populationSize, setPopulationSize] = useState(100);
  const [generations, setGenerations] = useState(50);
  const [mutationRate, setMutationRate] = useState(0.1);
  const [minRange, setMinRange] = useState(0);
  const [maxRange, setMaxRange] = useState(10);

  const [results, setResults] = useState<{
    bestSolution: number;
    bestFitness: number;
    bestChromosome: number[];
  } | null>(null);
  const [runningAlgorithm, setRunningAlgorithm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runGeneticAlgorithm = () => {
    setError(null);
    setRunningAlgorithm(true);

    try {
      // Create a function from user input
      const fitnessFunc = new Function("x", `return ${functionInput}`) as (
        x: number
      ) => number;

      // Test the function to catch any errors early
      fitnessFunc(1);

      // Use setTimeout to prevent UI freezing
      setTimeout(() => {
        const ga = new GeneticAlgorithm(fitnessFunc, {
          populationSize,
          generations,
          mutationRate,
          minRange,
          maxRange,
        });

        const evolutionResult = ga.evolve();

        setResults(evolutionResult);
        setRunningAlgorithm(false);
      }, 100);
    } catch (err) {
      setError("Invalid function. Please check your input.");
      setRunningAlgorithm(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Genetic Algorithm Optimizer
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">
              Fitness Function (use x as variable)
            </label>
            <input
              type="text"
              value={functionInput}
              onChange={(e) => setFunctionInput(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="e.g., x * Math.sin(x)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Min Range</label>
              <input
                type="number"
                value={minRange}
                onChange={(e) => setMinRange(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Max Range</label>
              <input
                type="number"
                value={maxRange}
                onChange={(e) => setMaxRange(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">
                Population Size
              </label>
              <input
                type="number"
                value={populationSize}
                onChange={(e) => setPopulationSize(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Generations</label>
              <input
                type="number"
                value={generations}
                onChange={(e) => setGenerations(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Mutation Rate</label>
            <input
              type="number"
              step="0.01"
              value={mutationRate}
              onChange={(e) => setMutationRate(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <button
            onClick={runGeneticAlgorithm}
            disabled={runningAlgorithm}
            className={`w-full px-6 py-3 rounded ${
              runningAlgorithm
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {runningAlgorithm ? "Running..." : "Run Genetic Algorithm"}
          </button>
        </div>

        {results && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <p>Best Solution: {results.bestSolution.toFixed(4)}</p>
            <p>Best Fitness: {results.bestFitness.toFixed(4)}</p>
            <p>Best Chromosome: {results.bestChromosome.join("")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
