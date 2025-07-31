"use client";
import { useRef, useState } from "react";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current!;
    const data = Object.fromEntries(new FormData(form));
    const { username, password } = data;
    try {
      const resp = await loginUser(username as string, password as string);
      login({ id: resp.id, username: resp.username }, resp.token);
      setError("");
      router.replace("/");
    } catch (err) {
      if (typeof err === "object" && err !== null && "message" in err) {
        setError((err as { message: string }).message);
      } else {
        setError("Login failed.");
      }
    }
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="bg-boardbg p-8 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-xs"
      >
        <h2 className="font-bold text-2xl text-primary text-center">Login</h2>
        {error && (
          <div className="bg-accent text-white p-2 rounded">{error}</div>
        )}
        <input
          required
          minLength={3}
          name="username"
          placeholder="Username"
          className="px-3 py-2 rounded bg-cellbg text-foreground border border-foreground/10"
        />
        <input
          required
          minLength={3}
          name="password"
          type="password"
          placeholder="Password"
          className="px-3 py-2 rounded bg-cellbg text-foreground border border-foreground/10"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-primary text-white py-2 rounded hover:bg-primary/80 font-bold"
        >
          Login
        </button>
        <a href="/register" className="text-xs text-accent text-center hover:underline">
          Don&#39;t have an account?
        </a>
      </form>
    </div>
  );
}
