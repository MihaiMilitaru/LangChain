import { api } from '../../api';

const rolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => 'roles',
      providesTags: ['roles'],
    }),
    getPermissions: builder.query({
      query: () => 'permissions',
    }),
    // deleteDocument: builder.mutation({
    //   query: (id) => ({
    //     url: `documents/${id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['roles'],
    // }),
    createRole: builder.mutation({
      query: (role) => ({
        url: 'roles',
        method: 'POST',
        body: role,
      }),
      invalidatesTags: ['roles'],
    }),
    updateRole: builder.mutation({
      query: (role) => ({
        url: `roles/${role.id}`,
        method: 'PATCH',
        body: role,
      }),
      invalidatesTags: ['roles'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useGetPermissionsQuery,
} = rolesApi;
