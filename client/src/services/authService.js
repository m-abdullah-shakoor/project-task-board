const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, body) {
  const response = await fetch(`${API_URL}/api/auth/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function registerUser(name, email, password) {
  return request("register", { name, email, password });
}
export function loginUser(email, password) {
  return request("login", { email, password });
}
export function loginWithGoogle(credential) {
  return request("google", { credential });
}
