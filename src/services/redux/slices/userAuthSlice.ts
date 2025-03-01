import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserAuthState {
    user: string;
    user_id: string;
    loggedIn: boolean;
}

const initialState: UserAuthState = {
    user: "",
    user_id: "",
    loggedIn: false,
}

export const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        userLogin: ((state, action: PayloadAction<{ user: string, user_id: string, loggedIn: boolean }>) => { 
            state.user = action.payload.user;
            state.user_id = action.payload.user_id;
            state.loggedIn = action.payload.loggedIn;
        }),
        userLogout: (state => {
            state.user = "";
            state.user_id = "";
            state.loggedIn = false;
        })
    }
});

export const { userLogin, userLogout } = userAuthSlice.actions; 

export default userAuthSlice.reducer;