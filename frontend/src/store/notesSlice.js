import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const notesSlice = createSlice({
    name:"notes",
    initialState:initialState,
    reducers:{
        setNotes:(state, action)=>{
            return action.payload;
        }
    }
});

export const {setNotes}  = notesSlice.actions;
export default notesSlice.reducer;