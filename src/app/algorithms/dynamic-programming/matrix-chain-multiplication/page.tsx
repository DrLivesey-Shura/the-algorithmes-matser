"use client";

import { useState } from "react";
import { matrixChainMultiplication } from "./matrix-chain-multiplication";

export default function MatrixChainMultiplicationPage() {
  const [dimensions, setDimensions] = useState<number[]>([10, 30, 5, 60]);
  const [result, setResult] = useState<{
    minMultiplications?: number;
    parenthesization?: string;
  }>({});

  const handleCalculate = () => {
    try {
      const calculationResult = matrixChainMultiplication(dimensions);
      setResult(calculationResult);
    } catch (error) {
      console.error("Error calculating matrix chain multiplication:", error);
      setResult({});
    }
  };

  const handleDimensionChange = (index: number, value: string) => {
    const newDimensions = [...dimensions];
    newDimensions[index] = parseInt(value, 10) || 0;
    setDimensions(newDimensions);
  };

  const addDimension = () => {
    if (dimensions.length > 0) {
      const lastDim = dimensions[dimensions.length - 1];
      setDimensions([...dimensions, lastDim]);
    } else {
      setDimensions([10]);
    }
  };

  const removeDimension = () => {
    if (dimensions.length > 2) {
      setDimensions(dimensions.slice(0, -1));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Matrix Chain Multiplication
      </h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Matrix Dimensions</label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {dimensions.map((dim, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-1">×</span>}
              <input
                type="number"
                value={dim}
                onChange={(e) => handleDimensionChange(index, e.target.value)}
                className="w-20 p-1 border rounded"
                min="1"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={addDimension}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Dimension
          </button>
          <button
            onClick={removeDimension}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            disabled={dimensions.length <= 2}
          >
            Remove Dimension
          </button>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-4"
      >
        Calculate Optimal Multiplication
      </button>

      {result.minMultiplications !== undefined && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Results:</h2>
          <p>
            <span className="font-semibold">Minimum Multiplications:</span>{" "}
            {result.minMultiplications}
          </p>
          <p>
            <span className="font-semibold">Optimal Parenthesization:</span>{" "}
            {result.parenthesization}
          </p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <p>
          Matrix Chain Multiplication determines the most efficient way to
          multiply a chain of matrices. It uses dynamic programming to minimize
          the total number of scalar multiplications needed.
        </p>
      </div>
    </div>
  );
}
