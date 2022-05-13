import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  userInfo : null,

  isAuthenticated: null,
  status: null,
};

export const UserSlice = createSlice( {
  name: 'user',
  initialState,
  reducers: {
    setProfile: ( state, action ) => {
      state.userInfo = action.payload;
    },
    setAuthentication: ( state, action ) => {
      state.isAuthenticated = action.payload;
    },
    setStatus: ( state, action ) => {
      state.status = action.payload;
    },
  },
} )

export const { setProfile, setAuthentication, setStatus } = UserSlice.actions;

export const UserReducer = UserSlice.reducer;