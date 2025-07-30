import {createSlice} from "@reduxjs/toolkit"
const initialState = {
    activeUser:null,
    isLoading:false
}

const userSlice = createSlice({
name:"user",
initialState:initialState,
reducers:{
    setUser:(state,action)=>{
        state.activeUser=action.payload;
    }
}
});

export const {setUser} = userSlice.actions;
export default userSlice.reducer;
