const API_BASE = "http://127.0.0.1:8000/api";

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error("Request failed");
    error.data = data;
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function getStudents(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/students/${query ? `?${query}` : ""}`);
  return handleResponse(res);
}

export async function getStudent(id) {
  const res = await fetch(`${API_BASE}/students/${id}/`);
  return handleResponse(res);
}

export async function createStudent(payload) {
  const res = await fetch(`${API_BASE}/students/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateStudent(id, payload) {
  const res = await fetch(`${API_BASE}/students/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteStudent(id) {
  const res = await fetch(`${API_BASE}/students/${id}/`, { method: "DELETE" });
  return handleResponse(res);
}
