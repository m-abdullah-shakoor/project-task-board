import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { getCurrentUser } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  // Only a stored token needs checking; without one, go straight to login.
  const [checkingSession, setCheckingSession] = useState(() =>
    Boolean(sessionStorage.getItem("token")),
  );

  useEffect(() => {
    if (!sessionStorage.getItem("token")) return;

    getCurrentUser()
      .then((result) => setUser(result.user || result.data || null))
      .catch(() => {
        sessionStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("token");
    setUser(null);
  }

  if (checkingSession) {
    return (
      <main className=" min-h-screen place-items-center bg-slate-950 text-slate-300">
        Loading your workspace...
      </main>
    );
  }

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <Login onLogin={setUser} />
  );
}
