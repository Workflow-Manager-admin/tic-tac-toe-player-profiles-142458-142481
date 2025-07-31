"use client";
import { useEffect, useState } from "react";
import { fetchGame, makeMove } from "@/lib/api";

type GameState = {
  id: string;
  board: string[]; // ["X", "O", ...]
  next: "X" | "O";
  winner: "X" | "O" | null;
  draw: boolean;
  players: { X: string; O: string };
};

export default function GameBoard({ gameId }: { gameId: string }) {
  const [game, setGame] = useState<GameState | null>(null);
  const [err, setErr] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Poll game state every 2 seconds.
  useEffect(() => {
    async function poll() {
      try {
        const data: GameState = await fetchGame(gameId);
        setGame(data);
      } catch (e) {
        if (typeof e === "object" && e !== null && "message" in e) {
          setErr((e as { message: string }).message);
        } else {
          setErr("Failed to fetch game.");
        }
      }
    }
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [gameId]);

  const playerRole: "X" | "O" | "" = (() => {
    if (!game) return "";
    // Assuming API responds with players: { X: username, O: username }
    const user = localStorage.getItem("user");
    if (!user) return "";
    const me = JSON.parse(user).username;
    const found = Object.entries(game.players).find(([, v]) => v === me)?.[0];
    if (found === "X" || found === "O") {
      return found;
    }
    return "";
  })();

  async function handleCellClick(idx: number) {
    if (!game || game.winner || game.draw) return;
    if (game.board[idx]) return;
    if (playerRole !== game.next) {
      setErr("Not your turn!");
      return;
    }
    try {
      setSubmitting(true);
      await makeMove(gameId, idx);
      setErr("");
    } catch (e) {
      if (typeof e === "object" && e !== null && "message" in e) {
        setErr((e as { message: string }).message);
      } else {
        setErr("Move failed.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (err) {
    return (
      <div className="p-4 bg-accent text-white rounded">
        Error: {err}
      </div>
    );
  }

  if (!game) return <div className="p-4">Loading game…</div>;

  const { board, next, winner, draw, players } = game;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full">
        <span className="text-secondary font-mono">
          You: {playerRole === "X" || playerRole === "O" ? players[playerRole] : "?"}
        </span>
        <span className="text-accent font-mono">
          Opponent: {playerRole === "X" ? players.O : playerRole === "O" ? players.X : "?"}
        </span>
      </div>
      <div
        className="grid grid-cols-3 grid-rows-3 gap-2 p-4 bg-boardbg rounded-lg shadow-lg"
        style={{ maxWidth: 300 }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i}
            disabled={
              !!board[i] ||
              winner !== null ||
              draw ||
              playerRole !== next ||
              submitting
            }
            onClick={() => handleCellClick(i)}
            className={`
              w-20 h-20 sm:w-24 sm:h-24
              flex items-center justify-center text-4xl sm:text-5xl
              bg-cellbg rounded shadow
              font-bold
              border-2 border-boardbg
              hover:border-primary
              transition
              disabled:opacity-60
              ${board[i] === "X" ? "text-primary" : board[i] === "O" ? "text-accent" : ""}
            `}
            aria-label={`Cell ${i + 1}`}
          >
            {board[i]}
          </button>
        ))}
      </div>
      <div className="w-full text-center text-lg mt-3">
        {winner ? (
          <div className="font-extrabold text-win text-xl">
            {winner === playerRole ? "🎉 You win!" : "😢 You lose!"}
          </div>
        ) : draw ? (
          <div className="font-bold text-draw text-xl">Draw!</div>
        ) : (
          <div>
            Turn: <span className={next === "X" ? "text-primary" : "text-accent"}>{next}</span>
            {playerRole === next && <span className="text-secondary ml-2 animate-pulse">Your move</span>}
          </div>
        )}
      </div>
    </div>
  );
}
