import { api } from '../../api';

const documentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: () => 'documents/all',
      providesTags: ['documents'],
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['documents'],
    }),
    createDocument: builder.mutation({
      query: (document) => ({
        url: 'documents/upload',
        method: 'POST',
        body: document,
      }),
      invalidatesTags: ['documents'],
    }),
    updateDocument: builder.mutation({
      query: (document) => ({
        url: `documents/${document.id}`,
        method: 'PUT',
        body: document.chapters,
      }),
      invalidatesTags: ['documents'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
} = documentsApi;
