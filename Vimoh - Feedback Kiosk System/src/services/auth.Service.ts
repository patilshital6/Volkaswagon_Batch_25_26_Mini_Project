const STORAGE_KEY = "authUsers";

export type AuthUser = {
  username: string;
  password: string;
  email: string;
  role: "EMPLOYEE";
};

function getUsers(): AuthUser[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users: AuthUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function registerUser(
  username: string,
  password: string,
  email: string
): boolean {
  const users = getUsers();

  if (users.some(u => u.username === username || u.email === email)) {
    return false;
  }

  users.push({ username, password, email, role: "EMPLOYEE" });
  saveUsers(users);
  return true;
}

export function loginUser(
  username: string,
  password: string
): AuthUser | null {
  const users = getUsers();
  return users.find(
    u => u.username === username && u.password === password
  ) || null;
}
