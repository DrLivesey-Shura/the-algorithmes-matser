"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  alphaBetaPruning,
  parseTreeInput,
  TreeNode,
} from "./alpha-beta-pruning";

const AlphaBetaPruningDemo: React.FC = () => {
  const [treeInput, setTreeInput] = useState<string>("");
  const [depth, setDepth] = useState<number>(3);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAlphaBetaPruning = () => {
    // Reset previous states
    setResult(null);
    setError(null);

    // Parse the input tree
    const gameTree = parseTreeInput(treeInput);

    if (!gameTree) {
      setError("Invalid tree structure. Please check your input.");
      return;
    }

    try {
      // Perform Alpha-Beta Pruning
      const optimalValue = alphaBetaPruning(
        gameTree,
        depth,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        true
      );

      setResult(optimalValue);
    } catch (err) {
      setError("An error occurred during Alpha-Beta Pruning");
    }
  };

  // Example input helper
  const setExampleInput = () => {
    setTreeInput(
      JSON.stringify(
        {
          children: [
            {
              children: [{ value: 3 }, { value: 5 }, { value: 2 }],
            },
            {
              children: [{ value: 7 }, { value: 1 }, { value: 4 }],
            },
            {
              children: [{ value: 6 }, { value: 8 }, { value: 9 }],
            },
          ],
        },
        null,
        2
      )
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Alpha-Beta Pruning Interactive Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Tree Structure (JSON)</Label>
            <Textarea
              value={treeInput}
              onChange={(e) => setTreeInput(e.target.value)}
              placeholder="Enter your tree structure as JSON"
              className="min-h-[200px]"
            />
            <Button
              variant="outline"
              onClick={setExampleInput}
              className="mt-2 w-full"
            >
              Load Example Tree
            </Button>
          </div>

          <div>
            <Label>Search Depth</Label>
            <Input
              type="number"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              min={1}
              max={10}
              className="w-full"
            />
          </div>

          <Button onClick={runAlphaBetaPruning} className="w-full">
            Run Alpha-Beta Pruning
          </Button>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}

          {result !== null && (
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Results:</h3>
              <p>Optimal Value: {result}</p>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <h4 className="font-semibold">Input Format:</h4>
            <p>
              Use a JSON structure with nested children and leaf nodes with
              'value'
            </p>
            <p>
              Example:{" "}
              {`{ "children": [{ "value": 3 }, { "children": [...] }] }`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlphaBetaPruningDemo;

/*
You can try this example 
{
  "children": [
    { "value": 3 },
    {
      "children": [
        { "value": 5 },
        { "value": 2 }
      ]
    }
  ]
}

*/
