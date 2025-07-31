"use client";
import { useEffect, useState } from "react";
import { getLeaderboard } from "@/lib/api";

type LeaderData = { username: string; wins: number; draws: number; losses: number; };

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderData[]>([]);

  useEffect(() => {
    getLeaderboard()
      .then(setLeaders)
      .catch(() => setLeaders([]));
  }, []);

  return (
    <section className="p-5">
      <h2 className="text-xl font-bold text-primary mb-3">Leaderboard 🏆</h2>
      <ol className="space-y-1">
        {leaders.map((l, idx) => (
          <li
            key={l.username}
            className={`flex justify-between items-center px-2 rounded py-1
              ${idx === 0 ? "bg-secondary/20 font-semibold" : ""}`}
          >
            <span>
              {idx + 1}. <span className="text-accent mr-1">{l.username}</span>
            </span>
            <span>
              <span className="text-win mr-2">W:{l.wins}</span>
              <span className="text-draw mr-2">D:{l.draws}</span>
              <span className="text-lose">L:{l.losses}</span>
            </span>
          </li>
        ))}
        {leaders.length === 0 && (
          <li className="text-xs text-gray-500">No data.</li>
        )}
      </ol>
    </section>
  );
}
