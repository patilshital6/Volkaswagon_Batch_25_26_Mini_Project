import { User } from "../models/user.js";
import {
  getUsers,
  addUser,
  deleteUser,
  generateUserId
} from "../data/user.api.js";

export function fetchAllUsers(): User[] {
  return getUsers();
}

export function createUser(
  name: string,
  email: string,
  role: User["role"],
  status: User["status"]
): User | null {
    const existingUsers = getUsers();

  const isDuplicate = existingUsers.some(
    user => user.email === email
  );

  if (isDuplicate) {
    return null;
  }
  const newUser: User = {
    id: generateUserId(),
    name,
    email,
    role,
    status
  };

  addUser(newUser);
  return newUser;
}
export function removeUser(userId: number): void {
  deleteUser(userId);
}
export function canGiveFeedback(status: User["status"]): boolean {
  return status === "APPROVED";
}

