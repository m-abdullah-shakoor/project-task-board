import { useState } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { loginWithGoogle } from "../services/authService";

export default function Login() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credential) => {
    try {
      setLoading(true);
      setMessage("");

      const data = await loginWithGoogle(credential);

    
      sessionStorage.setItem("token", data.token);

      setMessage(`Signed in as ${data.user.email}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Project Task Board</h1>
      <p>Sign in to manage your projects and tasks.</p>

      <GoogleLoginButton onSuccess={handleGoogleSuccess} />

      {loading && <p>Signing in...</p>}
      {message && <p role="status">{message}</p>}
    </main>
  );
}
