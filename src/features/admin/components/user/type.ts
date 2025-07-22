import { Res_getDriversListByAccountStatus } from "../../pages/type";

interface UserListProps {
  users: Res_getDriversListByAccountStatus[];
  type: "user" | "driver";
  isBlocked: "active" | "block" | "pending";
}


export type {UserListProps}