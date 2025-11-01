import { userLogout } from "../services/redux/slices/userSlice";
import { store } from "../services/redux/store";
import { Role } from "../types/commonTypes";
import { deleteData } from "../services/api/api-service";

export const handleLogout = (role: Role) => {
  console.log("logout=", role); 
  store.dispatch(userLogout());
  deleteData(`${role.toLowerCase()}/logout`);
  window.location.href = role === "Driver" ? "/driver/login" : "/login";
};
