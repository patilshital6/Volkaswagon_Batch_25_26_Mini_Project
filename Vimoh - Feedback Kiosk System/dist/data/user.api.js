let users = [
    {
        id: 1,
        name: "Amit",
        email: "amit@mail.com",
        role: "ADMIN",
        status: "APPROVED"
    },
    {
        id: 2,
        name: "Riya",
        email: "riya@mail.com",
        role: "USER",
        status: "PENDING"
    }
];
export function getUsers() {
    return users;
}
export function addUser(user) {
    users.push(user);
}
export function deleteUser(userId) {
    users = users.filter(user => user.id !== userId);
}
export function generateUserId() {
    return users.length > 0 ? users[users.length - 1].id + 1 : 1;
}
