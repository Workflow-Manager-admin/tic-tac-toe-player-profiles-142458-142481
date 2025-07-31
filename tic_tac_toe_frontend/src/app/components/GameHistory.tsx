"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getUserGames } from "@/lib/api";

type GameHist = {
  id: string;
  opponent: string;
  result: "win" | "draw" | "loss" | "ongoing";
};

export default function GameHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<GameHist[]>([]);

  useEffect(() => {
    if (user) {
      getUserGames(user.id)
        .then(setHistory)
        .catch(() => setHistory([]));
    }
  }, [user]);

  return (
    <section className="p-5">
      <h2 className="text-lg font-bold text-secondary mb-3">History 📓</h2>
      <ul className="space-y-1 max-h-40 overflow-y-auto">
        {history.map((g) => (
          <li
            key={g.id}
            className="flex justify-between px-2 py-1 rounded items-center bg-cellbg"
          >
            <span className="font-mono">#{g.id.slice(-4)} vs {g.opponent}</span>
            <span
              className={
                g.result === "win"
                  ? "text-win"
                  : g.result === "loss"
                  ? "text-lose"
                  : g.result === "draw"
                  ? "text-draw"
                  : "text-accent"
              }
            >
              {g.result}
            </span>
          </li>
        ))}
        {(history.length === 0) && <li className="text-xs text-gray-400">No games played.</li>}
      </ul>
    </section>
  );
}
