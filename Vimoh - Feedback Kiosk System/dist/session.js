let currentUser = null;
export function login(name, role) {
    currentUser = { name, role };
    localStorage.setItem("sessionUser", JSON.stringify(currentUser));
}
export function logout() {
    currentUser = null;
    localStorage.removeItem("sessionUser");
}
export function getSessionUser() {
    if (currentUser)
        return currentUser;
    const stored = localStorage.getItem("sessionUser");
    if (stored) {
        currentUser = JSON.parse(stored);
        return currentUser;
    }
    return null;
}
