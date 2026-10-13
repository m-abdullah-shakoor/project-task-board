const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export async function apiRequest(path, options = {}) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

export function getCurrentUser() {
  return apiRequest("/auth/me");
}

export function getProjects() {
  return apiRequest("/projects");
}

export function createProject(project) {
  return apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export function getTasks(projectId) {
  return apiRequest(`/projects/${projectId}/tasks`);
}

export function createTask(projectId, task) {
  return apiRequest(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(taskId, updates) {
  return apiRequest(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}
export function updateProject(projectId, updates) {
  return apiRequest(`/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function deleteTask(taskId) {
  return apiRequest(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export function deleteProject(projectId) {
  return apiRequest(`/projects/${projectId}`, {
    method: "DELETE",
  });
}
