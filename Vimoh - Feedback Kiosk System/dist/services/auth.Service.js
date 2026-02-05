const STORAGE_KEY = "authUsers";
function getUsers() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}
export function registerUser(username, password, email) {
    const users = getUsers();
    if (users.some(u => u.username === username || u.email === email)) {
        return false;
    }
    users.push({ username, password, email, role: "EMPLOYEE" });
    saveUsers(users);
    return true;
}
export function loginUser(username, password) {
    const users = getUsers();
    return users.find(u => u.username === username && u.password === password) || null;
}
