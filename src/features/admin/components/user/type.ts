
interface UserListProps {
  users: {
  _id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
  vehicle?: string;
  joiningDate: Date;
  userImage?: string;
  mobile: string;
}[];
  type: "user" | "driver";
  isBlocked: "active" | "block" | "pending";
}


export type {UserListProps}