import { Role } from "./role.js";
import { Status } from "./status.js";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
}
