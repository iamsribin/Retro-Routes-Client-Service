import { userLogout } from "../services/redux/slices/userSlice";
import { store } from "../services/redux/store";
import { Role } from "../types/commonTypes";
import { deleteData } from "../services/api/api-service";

export const handleLogout = async (role: Role) => {
  await store.dispatch(userLogout());
  await deleteData(`${role.toLowerCase()}/logout`,role);
};
