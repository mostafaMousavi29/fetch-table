import { configureStore, combineReducers } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';

const rootReducer = combineReducers({
  posts: postsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
