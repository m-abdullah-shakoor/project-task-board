import { useState } from "react";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";
import {
  loginUser,
  loginWithGoogle,
  registerUser,
} from "../services/authService";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function finishLogin(data) {
    if (!data.token) throw new Error("No authentication token returned.");

    sessionStorage.setItem("token", data.token);
    onLogin(data.user);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data =
        mode === "signup"
          ? await registerUser(name, email, password)
          : await loginUser(email, password);

      await finishLogin(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credential) {
    setMessage("");
    setLoading(true);

    try {
      const data = await loginWithGoogle(credential);
      await finishLogin(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-indigo-600 text-xl font-bold">
            T
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
          <p className="mt-2 text-sm text-slate-400">
            Organize your projects. Get things done.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-800 p-1">
          {["login", "signup"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setMessage("");
              }}
              className={`rounded-md py-2 text-sm font-medium capitalize transition ${
                mode === item
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {item === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <label className="block text-sm text-slate-300">
              Full name
              <input
                required
                maxLength={100}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="Your name"
              />
            </label>
          )}

          <label className="block text-sm text-slate-300">
            Email address
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Password
            <input
              required
              type="password"
              minLength={8}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
              placeholder="At least 8 characters"
            />
          </label>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
          <div className="h-px flex-1 bg-slate-800" />
          OR CONTINUE WITH
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <div className={loading ? "pointer-events-none opacity-60" : ""}>
          <GoogleLoginButton onSuccess={handleGoogleSuccess} />
        </div>

        {message && (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          Your projects, tasks, and progress in one place.
        </p>
      </section>
    </main>
  );
}
