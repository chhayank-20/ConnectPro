import {createSlice} from '@reduxjs/toolkit';
import { set } from 'mongoose';

const slice = createSlice({
    name : "authUser" ,
    initialState : {
        user : {}
    },
    reducers : {
        setUser : (state,action)=>{
            state.user = action.payload ;
        },
        setToken : (state,action)=>{
            state.user.token = action.payload ;
        }
    }
})

export const {setUser} = slice.actions;

export default slice.reducer;
