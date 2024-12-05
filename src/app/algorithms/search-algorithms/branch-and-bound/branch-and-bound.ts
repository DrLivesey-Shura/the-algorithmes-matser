// branch-and-bound.ts
export interface Item {
  weight: number;
  value: number;
}

export class BranchAndBoundSolver {
  private items: Item[];
  private capacity: number;
  private bestValue: number;
  private bestSelection: boolean[];

  constructor(items: Item[], capacity: number) {
    this.items = items;
    this.capacity = capacity;
    this.bestValue = 0;
    this.bestSelection = new Array(items.length).fill(false);
  }

  // Calculate upper bound using fractional knapsack
  private calculateUpperBound(
    index: number,
    currentWeight: number,
    currentValue: number
  ): number {
    let remainingCapacity = this.capacity - currentWeight;
    let upperBoundValue = currentValue;

    // Sort remaining items by value/weight ratio in descending order
    const remainingItems = this.items
      .slice(index + 1)
      .map((item) => ({
        ...item,
        ratio: item.value / item.weight,
      }))
      .sort((a, b) => b.ratio - a.ratio);

    for (const item of remainingItems) {
      if (remainingCapacity >= item.weight) {
        // Take full item
        upperBoundValue += item.value;
        remainingCapacity -= item.weight;
      } else {
        // Take fractional part
        upperBoundValue += item.ratio * remainingCapacity;
        break;
      }
    }

    return upperBoundValue;
  }

  // Recursive branch and bound method
  private explore(
    index: number,
    currentWeight: number,
    currentValue: number,
    currentSelection: boolean[]
  ): void {
    // Base case: explored all items
    if (index === this.items.length) {
      if (currentValue > this.bestValue) {
        this.bestValue = currentValue;
        this.bestSelection = [...currentSelection];
      }
      return;
    }

    // Calculate upper bound
    const upperBound = this.calculateUpperBound(
      index,
      currentWeight,
      currentValue
    );

    // Pruning: check if this path is promising
    if (upperBound <= this.bestValue) {
      return;
    }

    const currentItem = this.items[index];

    // Branch 1: Skip current item
    const skipSelection = [...currentSelection, false];
    this.explore(index + 1, currentWeight, currentValue, skipSelection);

    // Branch 2: Include current item if it fits
    if (currentWeight + currentItem.weight <= this.capacity) {
      const takeSelection = [...currentSelection, true];
      this.explore(
        index + 1,
        currentWeight + currentItem.weight,
        currentValue + currentItem.value,
        takeSelection
      );
    }
  }

  // Solve the knapsack problem using branch and bound
  solve(): {
    maxValue: number;
    selectedItems: Item[];
    selectedIndices: number[];
  } {
    // Start exploration
    this.explore(0, 0, 0, []);

    // Collect selected items
    const selectedItems = this.items.filter(
      (_, index) => this.bestSelection[index]
    );

    const selectedIndices = this.bestSelection.reduce(
      (acc, isSelected, index) => (isSelected ? [...acc, index] : acc),
      [] as number[]
    );

    return {
      maxValue: this.bestValue,
      selectedItems,
      selectedIndices,
    };
  }
}

// Example usage function
export function solveKnapsackProblem(items: Item[], capacity: number) {
  const solver = new BranchAndBoundSolver(items, capacity);
  return solver.solve();
}
