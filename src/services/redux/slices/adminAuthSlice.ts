import { createSlice } from "@reduxjs/toolkit";

const initialState={
    name:"",
    loggedIn:false
}

const adminAuthSlice=createSlice({
    name:"adminAuth",
    initialState,
    reducers:{
        adminLogin:((state,action)=>{
            state.name=action.payload.name,
            state.loggedIn=true
        }),
        adminLgout:((state)=>{
            state.name="",
            state.loggedIn=false
        })
    }

})

export const {adminLogin,adminLgout}=adminAuthSlice.actions

export default adminAuthSlice