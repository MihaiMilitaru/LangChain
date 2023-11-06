import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../..';

const initialState = {
  tokens: {
    accessToken: '',
    refreshToken: '',
  },
  data: {},
  role: -1,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, { payload }) => {
      state = payload;
    },
    logout: (state) => {
      (state.tokens = { accessToken: '', refreshToken: '' }),
        (state.data = {}),
        (state.role = -1);
    },

    setAccessToken: (state, { payload }) => {
      state.tokens.accessToken = payload;
    },

    setRefreshToken: (state, { payload }) => {
      state.tokens.refreshToken = payload;
    },

    setRole: (state, { payload }) => {
      state.role = payload;
    },
  },
});

export const { addUser, logout, setAccessToken, setRefreshToken, setRole } =
  userSlice.actions;

export const selectUser = (state: RootState) => state.users;

export const userReducer = userSlice.reducer;
