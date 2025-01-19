import {configureStore} from '@reduxjs/toolkit';
import authUserReducer from './authuser';

const store  = configureStore({
    reducer: {
        authorizedUser : authUserReducer,
    }
})


export default store;