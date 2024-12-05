"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BestFirstSearchSolver } from "./best-first-search";

const BestFirstSearchDemo: React.FC = () => {
  const [graphInput, setGraphInput] = useState<string>("");
  const [result, setResult] = useState<{
    path?: string[];
    totalCost?: number;
    error?: string;
  }>({});

  const runBestFirstSearch = () => {
    try {
      // Use default graph if no input provided
      const graphData =
        graphInput ||
        JSON.stringify(BestFirstSearchSolver.createSampleGraph(), null, 2);

      // Parse the graph
      const graph = BestFirstSearchSolver.parseGraph(graphData);

      // Validate graph structure
      if (!BestFirstSearchSolver.validateGraph(graph)) {
        throw new Error("Invalid graph structure");
      }

      // Perform Best-First Search
      const searchResult = BestFirstSearchSolver.bestFirstSearch(graph);

      if (searchResult) {
        setResult({
          path: searchResult.path,
          totalCost: searchResult.totalCost,
        });
      } else {
        setResult({ error: "No path found" });
      }
    } catch (err) {
      setResult({
        error:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  };

  // Load example graph
  const setExampleGraph = () => {
    setGraphInput(
      JSON.stringify(BestFirstSearchSolver.createSampleGraph(), null, 2)
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Best-First Search Interactive Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Graph Structure (JSON)</Label>
            <Textarea
              value={graphInput}
              onChange={(e) => setGraphInput(e.target.value)}
              placeholder="Enter your graph structure as JSON (optional)"
              className="min-h-[300px]"
            />
            <Button
              variant="outline"
              onClick={setExampleGraph}
              className="mt-2 w-full"
            >
              Load Example Graph
            </Button>
          </div>

          <Button onClick={runBestFirstSearch} className="w-full">
            Run Best-First Search
          </Button>

          {result.error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              {result.error}
            </div>
          )}

          {result.path && (
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Search Results:</h3>
              <p>Path Found: {result.path.join(" → ")}</p>
              <p>Total Cost: {result.totalCost}</p>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <h4 className="font-semibold">Input Format:</h4>
            <pre>{`{
  "graph": {
    "A": [
      { "node": "B", "cost": 1 },
      { "node": "C", "cost": 2 }
    ]
  },
  "heuristics": { "A": 7, "B": 6 },
  "start": "A",
  "goal": "B"
}`}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BestFirstSearchDemo;
