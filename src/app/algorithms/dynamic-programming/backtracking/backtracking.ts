// backtracking.ts
export interface BacktrackingResult {
  solution: number[][];
  totalSolutions: number;
}

export class BacktrackingSolver {
  // N-Queens solver using backtracking
  static solveNQueens(n: number): BacktrackingResult {
    const solutions: number[][] = [];
    const board: number[] = new Array(n).fill(-1);

    const isSafe = (row: number, col: number): boolean => {
      for (let i = 0; i < row; i++) {
        // Check column
        if (board[i] === col) return false;

        // Check diagonals
        const colDiff = Math.abs(board[i] - col);
        const rowDiff = row - i;
        if (colDiff === rowDiff) return false;
      }
      return true;
    };

    const backtrack = (row: number) => {
      // Base case: all queens are placed
      if (row === n) {
        solutions.push([...board]);
        return;
      }

      // Try placing queen in each column of current row
      for (let col = 0; col < n; col++) {
        if (isSafe(row, col)) {
          // Place queen
          board[row] = col;

          // Recurse to next row
          backtrack(row + 1);

          // Backtrack (remove queen)
          board[row] = -1;
        }
      }
    };

    // Start backtracking from first row
    backtrack(0);

    return {
      solution: solutions,
      totalSolutions: solutions.length,
    };
  }

  // Visualization helper to convert solution to board representation
  static convertToBoard(solution: number[], n: number): string[][] {
    const board: string[][] = Array.from({ length: n }, () =>
      Array(n).fill(".")
    );

    solution.forEach((col, row) => {
      board[row][col] = "Q";
    });

    return board;
  }
}
