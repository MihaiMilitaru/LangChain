import { api } from '../../api';

const chaptersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChapters: builder.query({
      query: () => 'chapters/all',
      providesTags: ['chapters'],
    }),
    deleteChapter: builder.mutation({
      query: (id) => ({
        url: `chapters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['chapters'],
    }),
    createChapter: builder.mutation({
      query: (chapter) => ({
        url: 'chapters',
        method: 'POST',
        body: { ...chapter },
      }),
      invalidatesTags: ['chapters'],
    }),
    updateChapter: builder.mutation({
      query: (chapter) => ({
        url: `chapters/${chapter.id}`,
        method: 'PUT',
        body: { ...chapter },
      }),
      invalidatesTags: ['chapters'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChaptersQuery,
  useDeleteChapterMutation,
  useCreateChapterMutation,
  useUpdateChapterMutation,
} = chaptersApi;
