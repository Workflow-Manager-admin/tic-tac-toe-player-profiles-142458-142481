"use client";
import GameHistory from "../components/GameHistory";

export default function GameHistoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">Your Game History</h1>
      <GameHistory />
    </div>
  );
}
