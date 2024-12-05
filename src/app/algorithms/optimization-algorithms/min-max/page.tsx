"use client";

import React, { useState, useEffect } from "react";
import { checkWinner, getBestMove } from "./min-max";

export default function TicTacToeGame() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<string>("");

  useEffect(() => {
    const winner = checkWinner(board);

    if (winner) {
      if (winner === "draw") {
        setGameStatus("It's a draw!");
      } else {
        setGameStatus(`${winner === "X" ? "You" : "AI"} won!`);
      }
      return;
    }

    if (!isPlayerTurn) {
      const aiMove = getBestMove(board);
      if (aiMove !== -1) {
        const newBoard = [...board];
        newBoard[aiMove] = "O";
        setBoard(newBoard);
        setIsPlayerTurn(true);
      }
    }
  }, [board, isPlayerTurn]);

  const handleCellClick = (index: number) => {
    if (!isPlayerTurn || board[index] || gameStatus) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setIsPlayerTurn(true);
    setGameStatus("");
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Tic Tac Toe with Min-Max AI</h1>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={`
              h-24 text-4xl font-bold border 
              ${cell === "X" ? "text-blue-600" : "text-red-600"}
              hover:bg-gray-100 transition
            `}
            >
              {cell}
            </button>
          ))}
        </div>

        {gameStatus && (
          <div className="mb-4">
            <p className="text-xl font-semibold">{gameStatus}</p>
            <button
              onClick={resetGame}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Reset Game
            </button>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>You are X. Try to beat the Min-Max AI!</p>
        </div>
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Minimax Algorithm Explained</h2>
          <p className="text-sm">
            The AI uses the Minimax algorithm to choose the best move. It:
            <ul className="list-disc list-inside">
              <li>Explores all possible future game states</li>
              <li>Assigns scores to each potential move</li>
              <li>Chooses the move with the highest chance of winning</li>
              <li>Uses alpha-beta pruning to optimize search</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}
