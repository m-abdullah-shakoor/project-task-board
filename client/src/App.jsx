import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { getCurrentUser } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return;
    }

    let cancelled = false;

    getCurrentUser()
      .then((result) => {
        if (!cancelled) {
          setUser(result.user || result.data || null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          sessionStorage.removeItem("token");
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setCheckingSession(false);
        }
      });

    return () => {
      cancelled = true;
    };
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
