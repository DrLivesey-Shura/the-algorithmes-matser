// tabu-search.ts
export interface TabuSearchOptions {
  maxIterations?: number;
  tabuListSize?: number;
  neighborhoodSize?: number;
}

export class TabuSearch {
  private currentSolution: number[];
  private bestSolution: number[];
  private objectiveFunction: (solution: number[]) => number;
  private generateNeighbor: (solution: number[]) => number[];
  private maxIterations: number;
  private tabuListSize: number;
  private neighborhoodSize: number;
  private tabuList: number[][];

  constructor(
    initialSolution: number[],
    objectiveFunction: (solution: number[]) => number,
    generateNeighbor: (solution: number[]) => number[],
    options: TabuSearchOptions = {}
  ) {
    this.currentSolution = initialSolution;
    this.bestSolution = [...initialSolution];
    this.objectiveFunction = objectiveFunction;
    this.generateNeighbor = generateNeighbor;

    // Default options
    this.maxIterations = options.maxIterations || 100;
    this.tabuListSize = options.tabuListSize || 10;
    this.neighborhoodSize = options.neighborhoodSize || 20;

    // Initialize tabu list
    this.tabuList = [];
  }

  // Check if a solution is in the tabu list
  private isTabu(solution: number[]): boolean {
    return this.tabuList.some((tabuSolution) =>
      this.arraysEqual(tabuSolution, solution)
    );
  }

  // Compare two arrays for equality
  private arraysEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  }

  // Add solution to tabu list
  private addToTabuList(solution: number[]): void {
    // If tabu list is full, remove the oldest solution
    if (this.tabuList.length >= this.tabuListSize) {
      this.tabuList.shift();
    }
    this.tabuList.push([...solution]);
  }

  // Perform Tabu Search
  public search(): {
    bestSolution: number[];
    bestObjectiveValue: number;
    iterationsPerformed: number;
  } {
    let bestObjectiveValue = this.objectiveFunction(this.bestSolution);
    let iteration = 0;

    while (iteration < this.maxIterations) {
      let bestNeighbor: number[] | null = null;
      let bestNeighborObjectiveValue = Number.NEGATIVE_INFINITY;

      // Generate and evaluate neighborhood
      for (let i = 0; i < this.neighborhoodSize; i++) {
        const neighbor = this.generateNeighbor(this.currentSolution);

        // Skip if neighbor is in tabu list
        if (this.isTabu(neighbor)) continue;

        const neighborObjectiveValue = this.objectiveFunction(neighbor);

        // Update best neighbor
        if (neighborObjectiveValue > bestNeighborObjectiveValue) {
          bestNeighbor = neighbor;
          bestNeighborObjectiveValue = neighborObjectiveValue;
        }
      }

      // If no non-tabu neighbor found, break
      if (!bestNeighbor) break;

      // Update current and best solutions
      this.currentSolution = bestNeighbor;
      this.addToTabuList(bestNeighbor);

      // Update global best if needed
      if (bestNeighborObjectiveValue > bestObjectiveValue) {
        this.bestSolution = bestNeighbor;
        bestObjectiveValue = bestNeighborObjectiveValue;
      }

      iteration++;
    }

    return {
      bestSolution: this.bestSolution,
      bestObjectiveValue,
      iterationsPerformed: iteration,
    };
  }
}

// Utility function to generate neighbors for different problem types
export const NeighborGenerators = {
  // Generate neighbor by slightly changing each element
  continuousRandomWalk: (solution: number[], step = 0.1) => {
    return solution.map((x) => x + (Math.random() * 2 - 1) * step);
  },

  // Generate neighbor by swapping elements
  permutationSwap: (solution: number[]) => {
    const neighbor = [...solution];
    const i = Math.floor(Math.random() * neighbor.length);
    const j = Math.floor(Math.random() * neighbor.length);

    // Swap elements
    [neighbor[i], neighbor[j]] = [neighbor[j], neighbor[i]];
    return neighbor;
  },

  // Generate neighbor by flipping bits (for binary problems)
  binaryFlip: (solution: number[]) => {
    const neighbor = [...solution];
    const index = Math.floor(Math.random() * neighbor.length);
    neighbor[index] = 1 - neighbor[index];
    return neighbor;
  },
};
