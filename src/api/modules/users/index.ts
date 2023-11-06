import { User } from '../../../types/Types';
import { api } from '../../api';

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
      providesTags: ['users'],
    }),
    patchUser: builder.mutation({
      query: (user: User) => ({
        url: `users/${user.id}`,
        method: 'PATCH',
        body: user.data,
      }),
      invalidatesTags: ['users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['users'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, usePatchUserMutation, useDeleteUserMutation } =
  usersApi;
