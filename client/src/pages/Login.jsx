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

  const inputClasses =
    "mt-2 w-full rounded-xl border border-[#D5DBD2] bg-white px-4 py-3 text-sm text-[#26352B] placeholder:text-[#9AA399] outline-none transition focus:border-[#66816A] focus:ring-2 focus:ring-[#66816A]/15";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F7F2] px-4 py-8 text-[#26352B] sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-[#E3E7DF] bg-white p-6 shadow-[0_12px_40px_rgba(38,53,43,0.07)] sm:p-8">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-[#66816A] text-xl font-bold text-white shadow-sm">
            T
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#212522]">
            Task Board
          </h1>

          <p className="mt-2 text-sm text-[#6B756C]">
            Organize your projects. Get things done.
          </p>
        </div>

        {/* Login / Signup switch */}
        <div className="mb-6 grid grid-cols-2 rounded-xl border border-[#E3E7DF] bg-[#F7F7F2] p-1">
          {["login", "signup"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setMessage("");
              }}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                mode === item
                  ? "bg-[#66816A] text-white shadow-sm"
                  : "text-[#6B756C] hover:bg-[#EDF2EB] hover:text-[#26352B]"
              }`}
            >
              {item === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        {/* Authentication form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <label className="block text-sm font-medium text-[#465348]">
              Full name
              <input
                required
                maxLength={100}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClasses}
                placeholder="Your name"
              />
            </label>
          )}

          <label className="block text-sm font-medium text-[#465348]">
            Email address
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClasses}
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-[#465348]">
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
              className={inputClasses}
              placeholder="At least 8 characters"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#66816A] py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#536B57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66816A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        {/* Google authentication divider */}
        <div className="my-6 flex items-center gap-3 text-xs font-medium tracking-wide text-[#899288]">
          <div className="h-px flex-1 bg-[#E3E7DF]" />
          <span>OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-[#E3E7DF]" />
        </div>

        <div className={loading ? "pointer-events-none opacity-60" : ""}>
          <GoogleLoginButton onSuccess={handleGoogleSuccess} />
        </div>

        {/* Feedback */}
        {message && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-[#F2D5D2] bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318]"
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-xs leading-5 text-[#7B857B]">
          Your projects, tasks, and progress in one place.
        </p>
      </section>
    </main>
  );
}
