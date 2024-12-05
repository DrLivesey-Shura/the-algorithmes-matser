export function matrixChainMultiplication(dimensions: number[]): {
  minMultiplications: number;
  parenthesization: string;
} {
  const n = dimensions.length - 1;

  // Create 2D arrays to store minimum multiplications and split points
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const split: number[][] = Array.from({ length: n }, () =>
    new Array(n).fill(0)
  );

  // Iterate through different chain lengths
  for (let chainLength = 2; chainLength <= n; chainLength++) {
    for (let i = 0; i <= n - chainLength; i++) {
      const j = i + chainLength - 1;

      // Initialize with a large value
      dp[i][j] = Infinity;

      // Try different split points
      for (let k = i; k < j; k++) {
        const cost =
          dp[i][k] +
          dp[k + 1][j] +
          dimensions[i] * dimensions[k + 1] * dimensions[j + 1];

        // Update if we found a better solution
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          split[i][j] = k;
        }
      }
    }
  }

  // Reconstruct the optimal parenthesization
  function buildParenthesization(i: number, j: number): string {
    if (i === j) return `A${i + 1}`;
    if (i + 1 === j) return `(A${i + 1}A${j + 1})`;

    const k = split[i][j];
    const left = buildParenthesization(i, k);
    const right = buildParenthesization(k + 1, j);

    return `(${left}${right})`;
  }

  return {
    minMultiplications: dp[0][n - 1],
    parenthesization: buildParenthesization(0, n - 1),
  };
}

// Example usage function
export function demonstrateMatrixChainMultiplication() {
  // Example matrix dimensions: A1 is 10x30, A2 is 30x5, A3 is 5x60
  const dimensions = [10, 30, 5, 60];

  const result = matrixChainMultiplication(dimensions);

  console.log("Minimum number of multiplications:", result.minMultiplications);
  console.log("Optimal Parenthesization:", result.parenthesization);

  return result;
}
