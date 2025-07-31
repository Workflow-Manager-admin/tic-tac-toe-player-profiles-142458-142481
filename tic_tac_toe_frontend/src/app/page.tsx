"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { startGame, fetchGame } from "@/lib/api";
import GameBoard from "./components/GameBoard";

export default function Home() {
  const { user } = useAuth();
  const [gameId, setGameId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  async function onStartGame() {
    try {
      const game = await startGame();
      setGameId(game.id);
      setError("");
    } catch (e) {
      if (typeof e === "object" && e !== null && "message" in e) {
        setError((e as { message: string }).message);
      } else {
        setError("Unable to start game.");
      }
    }
  }

  const [manualGame, setManualGame] = useState("");

  async function onJoin() {
    try {
      // Validate game ID
      const game = await fetchGame(manualGame.trim());
      setGameId(game.id);
      setError("");
    } catch {
      setError("No such game or unauthorized.");
    }
  }

  if (!user)
    return (
      <div className="min-h-[60vh] flex flex-col gap-4 items-center justify-center">
        <h1 className="text-3xl font-extrabold text-primary">Tic Tac Toe</h1>
        <p>
          Please <a href="/login" className="text-accent underline">log in</a> or{" "}
          <a href="/register" className="text-secondary underline">register</a> to play.
        </p>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-8 py-8">
      <h1 className="text-2xl font-bold text-primary">👋 Welcome, {user.username}!</h1>
      {error && <div className="bg-accent text-white p-3 rounded">{error}</div>}
      {gameId ? (
        <GameBoard gameId={gameId} />
      ) : (
        <div className="flex flex-col gap-5 bg-boardbg p-6 rounded-lg shadow-xl">
          <button
            onClick={onStartGame}
            className="bg-primary text-white font-bold rounded py-3 hover:bg-primary/80 transition"
          >
            Start New Game
          </button>
          <form onSubmit={onJoin} className="flex gap-2 items-center">
            <input
              value={manualGame}
              onChange={e => setManualGame(e.target.value)}
              placeholder="Enter Game ID"
              className="flex-1 p-2 rounded bg-cellbg text-foreground border"
            />
            <button
              type="submit"
              className="bg-secondary text-foreground rounded px-4 py-2 font-mono hover:bg-secondary/80"
            >
              Join
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
