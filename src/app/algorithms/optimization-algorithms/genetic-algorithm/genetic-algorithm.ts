// genetic-algorithm.ts
export class GeneticAlgorithm {
  // Genetic Algorithm parameters
  private populationSize: number;
  private chromosomeLength: number;
  private mutationRate: number;
  private generations: number;
  private fitnessFunc: (x: number) => number;
  private minRange: number;
  private maxRange: number;

  constructor(
    fitnessFunction: (x: number) => number,
    options: {
      populationSize?: number;
      chromosomeLength?: number;
      mutationRate?: number;
      generations?: number;
      minRange?: number;
      maxRange?: number;
    } = {}
  ) {
    const {
      populationSize = 100,
      chromosomeLength = 16,
      mutationRate = 0.1,
      generations = 50,
      minRange = 0,
      maxRange = 10,
    } = options;

    this.fitnessFunc = fitnessFunction;
    this.populationSize = populationSize;
    this.chromosomeLength = chromosomeLength;
    this.mutationRate = mutationRate;
    this.generations = generations;
    this.minRange = minRange;
    this.maxRange = maxRange;
  }

  // Fitness function wrapper
  private calculateFitness(chromosome: number[]): number {
    const x = this.decodeChromosome(chromosome);
    return this.fitnessFunc(x);
  }

  // Decode binary chromosome to a real number
  private decodeChromosome(chromosome: number[]): number {
    // Convert binary to decimal
    const decimal = parseInt(chromosome.join(""), 2);
    // Scale to desired range
    return (
      this.minRange +
      (decimal / (Math.pow(2, this.chromosomeLength) - 1)) *
        (this.maxRange - this.minRange)
    );
  }

  // Initialize random population
  private initializePopulation(): number[][] {
    return Array.from({ length: this.populationSize }, () =>
      Array.from({ length: this.chromosomeLength }, () =>
        Math.round(Math.random())
      )
    );
  }

  // Selection using tournament selection
  private selection(population: number[][]): number[][] {
    const selectedPopulation: number[][] = [];

    for (let i = 0; i < this.populationSize; i++) {
      // Tournament selection: choose 3 random individuals
      const tournament = Array.from(
        { length: 3 },
        () => population[Math.floor(Math.random() * population.length)]
      );

      // Select the individual with highest fitness
      const winner = tournament.reduce((best, current) =>
        this.calculateFitness(current) > this.calculateFitness(best)
          ? current
          : best
      );

      selectedPopulation.push([...winner]);
    }

    return selectedPopulation;
  }

  // Crossover (single-point crossover)
  private crossover(parent1: number[], parent2: number[]): number[][] {
    const crossoverPoint = Math.floor(Math.random() * this.chromosomeLength);

    const child1 = [
      ...parent1.slice(0, crossoverPoint),
      ...parent2.slice(crossoverPoint),
    ];

    const child2 = [
      ...parent2.slice(0, crossoverPoint),
      ...parent1.slice(crossoverPoint),
    ];

    return [child1, child2];
  }

  // Mutation
  private mutate(chromosome: number[]): number[] {
    return chromosome.map((gene) =>
      Math.random() < this.mutationRate
        ? 1 - gene // Flip the bit
        : gene
    );
  }

  // Run genetic algorithm
  public evolve(): {
    bestChromosome: number[];
    bestFitness: number;
    bestSolution: number;
  } {
    // Initialize population
    let population = this.initializePopulation();

    let bestResult: {
      bestChromosome: number[];
      bestFitness: number;
      bestSolution: number;
    } = {
      bestChromosome: [],
      bestFitness: Number.NEGATIVE_INFINITY,
      bestSolution: 0,
    };

    // Evolution process
    for (let generation = 0; generation < this.generations; generation++) {
      // Evaluate fitness
      const populationFitness = population.map((chromosome) => ({
        chromosome,
        fitness: this.calculateFitness(chromosome),
      }));

      // Find best individual
      const generationBest = populationFitness.reduce((best, current) =>
        current.fitness > best.fitness ? current : best
      );

      // Update best result if needed
      if (generationBest.fitness > bestResult.bestFitness) {
        bestResult = {
          bestChromosome: generationBest.chromosome,
          bestFitness: generationBest.fitness,
          bestSolution: this.decodeChromosome(generationBest.chromosome),
        };
      }

      // Selection
      const selectedPopulation = this.selection(population);

      // Create next generation
      const nextPopulation: number[][] = [];

      while (nextPopulation.length < this.populationSize) {
        // Random pair for crossover
        const parent1 =
          selectedPopulation[
            Math.floor(Math.random() * selectedPopulation.length)
          ];
        const parent2 =
          selectedPopulation[
            Math.floor(Math.random() * selectedPopulation.length)
          ];

        // Crossover
        const children = this.crossover(parent1, parent2);

        // Mutation
        const mutatedChildren = children.map((child) => this.mutate(child));

        nextPopulation.push(...mutatedChildren);
      }

      // Trim to original population size
      population = nextPopulation.slice(0, this.populationSize);
    }

    return bestResult;
  }
}
