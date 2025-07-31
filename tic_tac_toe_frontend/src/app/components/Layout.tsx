"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Leaderboard from "./Leaderboard";
import GameHistory from "./GameHistory";
import { useAuth } from "@/lib/auth";

const navItems = [
  { name: "Play", href: "/" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "History", href: "/history" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="flex items-center justify-between p-4 border-b border-foreground/10 bg-boardbg sticky top-0 z-10">
        <div className="flex gap-4 items-center">
          <span className="font-bold text-primary text-lg tracking-wide">Tic Tac Toe</span>
          <nav className="flex gap-3">
            {navItems.map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1 rounded transition
                 ${pathname === href ? "text-accent bg-primary/10" : "hover:bg-foreground/10"}`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          {user ? (
            <span className="flex gap-3 items-center">
              <span className="text-secondary">👤 {user.username}</span>
              <button
                onClick={logout}
                className="ml-2 px-2 py-1 rounded text-sm bg-accent text-white hover:bg-accent/80"
              >Logout</button>
            </span>
          ) : (
            <span className="flex gap-3">
              <Link href="/login" className="text-primary">Login</Link>
              <Link href="/register" className="text-accent">Register</Link>
            </span>
          )}
        </div>
      </header>
      <main className="flex flex-1">
        <aside className="hidden lg:flex flex-col w-1/4 min-w-[300px] bg-boardbg border-r border-foreground/10">
          <Leaderboard />
          <GameHistory />
        </aside>
        <section className="flex-1 p-4 sm:p-8 max-w-3xl mx-auto w-full">{children}</section>
        <aside className="hidden xl:flex w-1/4" />
      </main>
    </div>
  );
}
