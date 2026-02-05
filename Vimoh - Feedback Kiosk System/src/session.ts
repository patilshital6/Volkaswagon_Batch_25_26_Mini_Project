export type SessionRole = "ADMIN" | "EMPLOYEE" | null;

export interface SessionUser {
  name: string;
  role: SessionRole;
}

let currentUser: SessionUser | null = null;

export function login(name: string, role: SessionRole) {
  currentUser = { name, role };
  localStorage.setItem("sessionUser", JSON.stringify(currentUser));
}

export function logout() {
  currentUser = null;
  localStorage.removeItem("sessionUser");
}

export function getSessionUser(): SessionUser | null {
  if (currentUser) return currentUser;

  const stored = localStorage.getItem("sessionUser");
  if (stored) {
    currentUser = JSON.parse(stored);
    return currentUser;
  }

  return null;
}
