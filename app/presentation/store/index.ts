import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import pokemonReducer from './pokemonSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['pokemon'],
};

const persistedReducer = persistReducer(persistConfig, pokemonReducer);

export const store = configureStore({
  reducer: {
    pokemon: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;