import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetPokemons } from "../../domain/usecases/GetPokemons";

const getPokemons = new GetPokemons();

export const fetchPokemons = createAsyncThunk(
  "pokemon/fetchPokemons",
  async ({ limit, offset }: { limit: number; offset: number }) => {
    return await getPokemons.execute(limit, offset);
  }
);

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState: {
    list: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results;
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error cargando pokemons";
      });
  },
});

export default pokemonSlice.reducer;
