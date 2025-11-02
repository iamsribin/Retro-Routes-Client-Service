import { userLogout } from "../services/redux/slices/userSlice";
import { store } from "../services/redux/store";
import { Role } from "../types/commonTypes";
import { deleteData } from "../services/api/api-service";

export const handleLogout = async (role: Role) => {
  console.log("logout=", role); 
  await store.dispatch(userLogout());
  window.location.href = role === "Driver" ? "/driver/login" : "/login";
  await deleteData(`${role.toLowerCase()}/logout`);
};
