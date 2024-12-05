"use client";

import React, { useState } from "react";
import {
  parsePolynomial,
  addPolynomials,
  multiplyPolynomials,
  polynomialToString,
} from "./lisp-polynomial-manipulation";

export default function PolynomialCalculator() {
  const [poly1, setPoly1] = useState("");
  const [poly2, setPoly2] = useState("");
  const [operation, setOperation] = useState<"add" | "multiply">("add");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleCalculate = () => {
    try {
      // Clear previous errors
      setError("");

      // Parse polynomials
      const parsedPoly1 = parsePolynomial(poly1);
      const parsedPoly2 = parsePolynomial(poly2);

      // Perform selected operation
      let calculatedResult: number[];
      if (operation === "add") {
        calculatedResult = addPolynomials(parsedPoly1, parsedPoly2);
      } else {
        calculatedResult = multiplyPolynomials(parsedPoly1, parsedPoly2);
      }

      // Convert result to string representation
      setResult(polynomialToString(calculatedResult));
    } catch (err) {
      setError("Invalid polynomial input. Please check your syntax.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Polynomial Calculator</h1>

      <div className="mb-4">
        <label htmlFor="poly1" className="block mb-2">
          Polynomial 1
        </label>
        <input
          id="poly1"
          type="text"
          value={poly1}
          onChange={(e) => setPoly1(e.target.value)}
          placeholder="Enter first polynomial (e.g., 3x^2 + 2x - 1)"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="poly2" className="block mb-2">
          Polynomial 2
        </label>
        <input
          id="poly2"
          type="text"
          value={poly2}
          onChange={(e) => setPoly2(e.target.value)}
          placeholder="Enter second polynomial (e.g., x + 5)"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="operation" className="block mb-2">
          Operation
        </label>
        <select
          id="operation"
          value={operation}
          onChange={(e) => setOperation(e.target.value as "add" | "multiply")}
          className="w-full p-2 border rounded"
        >
          <option value="add">Add</option>
          <option value="multiply">Multiply</option>
        </select>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Calculate
      </button>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {result && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
}
