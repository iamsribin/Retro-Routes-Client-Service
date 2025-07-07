import { createSlice } from "@reduxjs/toolkit";
const initialState={
    isOpenPending:false
}

const pendingModalSlice=createSlice({
    name:"pendingModal",
    initialState,
    reducers:{
        openPendingModal:(state)=>{
            state.isOpenPending=true
        },
        closingPendingModal:(state)=>{
            state.isOpenPending=false
        }
    }
})

export const {openPendingModal,closingPendingModal}=pendingModalSlice.actions

export default pendingModalSlice.reducer