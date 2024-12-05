"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { solveKnapsackProblem, Item } from "./branch-and-bound";

export default function BranchAndBoundPage() {
  const [items, setItems] = useState<Item[]>([
    { weight: 10, value: 60 },
    { weight: 20, value: 100 },
    { weight: 30, value: 120 },
  ]);
  const [capacity, setCapacity] = useState(50);
  const [result, setResult] = useState<{
    maxValue: number;
    selectedItems: Item[];
    selectedIndices: number[];
  } | null>(null);

  const handleAddItem = () => {
    setItems([...items, { weight: 0, value: 0 }]);
  };

  const updateItem = (index: number, field: keyof Item, value: number) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const solve = () => {
    const solution = solveKnapsackProblem(items, capacity);
    setResult(solution);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Branch and Bound - Knapsack Problem Solver</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Knapsack Capacity Input */}
          <div className="mb-4">
            <Label htmlFor="capacity">Knapsack Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Items Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Weight</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.weight}
                      onChange={(e) =>
                        updateItem(index, "weight", Number(e.target.value))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.value}
                      onChange={(e) =>
                        updateItem(index, "value", Number(e.target.value))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            <Button onClick={handleAddItem}>Add Item</Button>
            <Button onClick={solve}>Solve Knapsack Problem</Button>
          </div>

          {/* Results Display */}
          {result && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Maximum Value: {result.maxValue}</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Selected Item</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.selectedItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          Item {result.selectedIndices[index]}
                        </TableCell>
                        <TableCell>{item.weight}</TableCell>
                        <TableCell>{item.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
