import { PokedexItem } from "@/app/domain/entities/PokedexItem";
import { Pokemon } from "@/app/domain/entities/Pokemon";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetPokemons } from "../../domain/usecases/GetPokemons";

const getPokemons = new GetPokemons();

export const fetchPokemons = createAsyncThunk(
  "pokemon/fetchPokemons",
  async ({ limit, offset }: { limit: number; offset: number }) => {
    return await getPokemons.execute(limit, offset);
  }
);

interface PokemonState {
  list: Pokemon[];
  pokedex: PokedexItem[];
  loading: boolean;
  error: string | null;
}

const initialState: PokemonState = {
  list: [],
  pokedex: [],
  loading: false,
  error: null,
};

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    addToPokedex: (state, action: PayloadAction<Pokemon>) => {
      const existingItem = state.pokedex.find(item => item.pokemon.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.pokedex.push({
          pokemon: action.payload,
          quantity: 1
        });
      }
    },
    
    removeFromPokedex: (state, action: PayloadAction<string>) => {
      const existingItem = state.pokedex.find(item => item.pokemon.id === action.payload);
      
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.pokedex = state.pokedex.filter(item => item.pokemon.id !== action.payload);
        }
      }
    },
    
    removeAllFromPokedex: (state, action: PayloadAction<string>) => {
      state.pokedex = state.pokedex.filter(item => item.pokemon.id !== action.payload);
    },
    
    clearPokedex: (state) => {
      state.pokedex = [];
    },
    
    updatePokedexQuantity: (state, action: PayloadAction<{pokemonId: string, quantity: number}>) => {
      const { pokemonId, quantity } = action.payload;
      const existingItem = state.pokedex.find(item => item.pokemon.id === pokemonId);
      
      if (existingItem) {
        if (quantity <= 0) {
          state.pokedex = state.pokedex.filter(item => item.pokemon.id !== pokemonId);
        } else {
          existingItem.quantity = quantity;
        }
      }
    },
    
    swapPokedexItems: (state, action: PayloadAction<{fromIndex: number, toIndex: number}>) => {
      const { fromIndex, toIndex } = action.payload;
      const items = [...state.pokedex];
      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
      state.pokedex = items;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error cargando pokemons";
      });
  },
});

export const selectTotalPokemons = (state: { pokemon: PokemonState }) => {
  return state.pokemon.pokedex.reduce((total, item) => total + item.quantity, 0);
};

export const selectPokedexItems = (state: { pokemon: PokemonState }) => state.pokemon.pokedex;

export const selectPokemonQuantity = (pokemonId: string) => {
  return (state: { pokemon: PokemonState }) => {
    const item = state.pokemon.pokedex.find(item => item.pokemon.id === pokemonId);
    return item ? item.quantity : 0;
  };
};

export const selectPokedex = (state: { pokemon: PokemonState }) => state.pokemon.pokedex;

export const { 
  addToPokedex, 
  removeFromPokedex, 
  removeAllFromPokedex, 
  clearPokedex,
  updatePokedexQuantity,
  swapPokedexItems
} = pokemonSlice.actions;

export default pokemonSlice.reducer;