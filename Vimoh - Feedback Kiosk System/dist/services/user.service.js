import { getUsers, addUser, deleteUser, generateUserId } from "../data/user.api.js";
export function fetchAllUsers() {
    return getUsers();
}
export function createUser(name, email, role, status) {
    const existingUsers = getUsers();
    const isDuplicate = existingUsers.some(user => user.email === email);
    if (isDuplicate) {
        return null;
    }
    const newUser = {
        id: generateUserId(),
        name,
        email,
        role,
        status
    };
    addUser(newUser);
    return newUser;
}
export function removeUser(userId) {
    deleteUser(userId);
}
export function canGiveFeedback(status) {
    return status === "APPROVED";
}
