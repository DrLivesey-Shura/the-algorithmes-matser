"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BacktrackingSolver } from "./backtracking";

const BacktrackingDemo: React.FC = () => {
  const [nQueensSize, setNQueensSize] = useState<number>(4);
  const [numberSolutions, setNumberSolutions] = useState<number>(2);

  const [activeTab, setActiveTab] = useState<string>("n-queens");

  // N-Queens state
  const [queensSolutions, setQueensSolutions] = useState<string[][][]>([]);

  const solveNQueens = () => {
    const { solution } = BacktrackingSolver.solveNQueens(nQueensSize);

    // Convert solutions to board representation
    const boardSolutions = solution.map((sol) =>
      BacktrackingSolver.convertToBoard(sol, nQueensSize)
    );

    setQueensSolutions(boardSolutions);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Backtracking Algorithms Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols">
            <TabsTrigger value="n-queens">N-Queens</TabsTrigger>
          </TabsList>

          {/* N-Queens Tab */}
          <TabsContent value="n-queens">
            <div className="space-y-4">
              <div>
                <Label>Board Size</Label>
                <Input
                  type="number"
                  value={nQueensSize}
                  onChange={(e) => setNQueensSize(Number(e.target.value))}
                  min={4}
                  max={8}
                  className="w-full"
                />
                <Label>Solutions number</Label>
                <Input
                  type="number"
                  value={numberSolutions}
                  onChange={(e) => setNumberSolutions(Number(e.target.value))}
                  min={2}
                  max={10}
                  className="w-full"
                />
              </div>

              <Button onClick={solveNQueens} className="w-full">
                Solve N-Queens
              </Button>

              {queensSolutions.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold">
                    Solutions (Total: {queensSolutions.length})
                  </h3>
                  {queensSolutions
                    .slice(0, numberSolutions)
                    .map((solution, index) => (
                      <div key={index} className="mt-2">
                        <h4>Solution {index + 1}</h4>
                        <div className="grid grid-cols-1 gap-1">
                          {solution.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex justify-center">
                              {row.map((cell, colIndex) => (
                                <div
                                  key={colIndex}
                                  className={`w-6 h-6 border flex items-center justify-center 
                                  ${
                                    cell === "Q"
                                      ? "bg-black text-white"
                                      : "bg-white"
                                  }`}
                                >
                                  {cell}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BacktrackingDemo;
