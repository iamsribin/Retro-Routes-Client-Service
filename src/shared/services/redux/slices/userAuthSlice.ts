// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface UserAuthState {
//   user: string;
//   user_id: string;
//   loggedIn: boolean;
//   role: "User" | "";
//   mobile:number | undefined;
//   profile: string;
// }

// const initialState: UserAuthState = {
//   user: "",
//   user_id: "",
//   loggedIn: false,
//   role: "",
//   mobile:undefined,
//   profile: ""
// };

// export const userAuthSlice = createSlice({
//   name: "userAuth",
//   initialState,
//   reducers: {
//     userLogin: (
//       state,
//       action: PayloadAction<{
//         user: string;
//         user_id: string;
//         role: "User";
//         mobile:number | undefined;
//         profile: string;
//       }>
//     ) => {
//       state.user = action.payload.user;
//       state.user_id = action.payload.user_id;
//       state.loggedIn = true;
//       state.role = action.payload.role;
//       state.mobile = action.payload.mobile;
//       state.profile = action.payload.profile
//     },
//     userLogout: (state) => {
//       state.user = "";
//       state.user_id = "";
//       state.loggedIn = false;
//       state.role = "";
//       state.profile = "";
//       state.mobile= undefined;
//     },
//   },
// });

// export const { userLogin, userLogout } = userAuthSlice.actions;

// export default userAuthSlice.reducer;