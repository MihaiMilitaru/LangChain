/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../../api';

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => 'profile',
    }),
    fetchAuthTokens: builder.query<any, void>({
      query: (params: any) => {
        return {
          url: 'auth/google-login',
          params,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useLazyFetchAuthTokensQuery,
  useFetchAuthTokensQuery,
} = authApi;
