import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPostsAPI } from './postsService';

export type TStatusResponse = 'idle' | 'loading' | 'succeeded' | 'failed';

export const getPosts = createAsyncThunk(
  'posts/getPosts',
  async ({ offset, limit }: { offset: number; limit: number }) => {
    return await fetchPostsAPI(offset, limit);
  }
);

interface PostsState {
  data: any[];
  meta: { pagination: { total: number; limit: number; offset: number } };
  status: TStatusResponse;
  error: string | null;
}

const initialState: PostsState = {
  data: [],
  meta: { pagination: { total: 0, limit: 10, offset: 0 } },
  status: 'idle',
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load posts';
      });
  },
});

export default postsSlice.reducer;
