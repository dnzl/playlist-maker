import { configureStore } from "@reduxjs/toolkit";
import artistSearchReducer from "./artists";
import { setlistApi } from "./setlistService";
import { setupListeners } from "@reduxjs/toolkit/query";
import { spotifyApi } from "./spotifyService";

export const store = configureStore({
  reducer: {
    artists: artistSearchReducer,
    [setlistApi.reducerPath]: setlistApi.reducer,
    [spotifyApi.reducerPath]: spotifyApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([setlistApi.middleware, spotifyApi.middleware]),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
