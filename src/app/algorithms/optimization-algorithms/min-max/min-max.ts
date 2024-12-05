export interface MinMaxState {
  board: string[];
  currentPlayer: string;
}

export function checkWinner(board: string[]): string | null {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.includes("") ? null : "draw";
}

export function getEmptySquares(board: string[]): number[] {
  return board.reduce((empty, cell, index) => {
    if (cell === "") empty.push(index);
    return empty;
  }, [] as number[]);
}

export function minMaxAlgorithm(
  board: string[],
  depth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity
): number {
  const winner = checkWinner(board);

  if (winner === "X") return 10 - depth;
  if (winner === "O") return depth - 10;
  if (winner === "draw") return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const index of getEmptySquares(board)) {
      board[index] = "X";
      const score = minMaxAlgorithm(board, depth + 1, false, alpha, beta);
      board[index] = "";
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const index of getEmptySquares(board)) {
      board[index] = "O";
      const score = minMaxAlgorithm(board, depth + 1, true, alpha, beta);
      board[index] = "";
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }
    return bestScore;
  }
}

export function getBestMove(board: string[]): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (const index of getEmptySquares(board)) {
    board[index] = "X";
    const score = minMaxAlgorithm(board, 0, false);
    board[index] = "";

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
}
