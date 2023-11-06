/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  setAccessToken,
  setRefreshToken,
  logout,
  setRole,
} from '../store/slices/user';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',

  prepareHeaders: (headers, { getState }) => {
    const base = (getState() as any).users.tokens;
    let token = base.accessToken;

    const isRefreshAction = headers.get('is-refresh-action');
    if (isRefreshAction === 'true') {
      token = base.refreshToken;
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult: any = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        headers: {
          'is-refresh-action': 'true',
        },
      },
      api,
      extraOptions
    );
    if (refreshResult?.data) {
      api.dispatch(setAccessToken(refreshResult.data.accessToken));
      api.dispatch(setRefreshToken(refreshResult.data.refreshToken));
      fetch('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${refreshResult.data.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => api.dispatch(setRole(data.role.id)));
    } else {
      api.dispatch(logout());
    }

    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['chapters', 'documents', 'roles', 'users'],
});
