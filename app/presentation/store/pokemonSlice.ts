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

interface PendingOperation {
  type: 'add' | 'remove' | 'removeAll' | 'update' | 'clear';
  payload: any;
  timestamp: number;
  id?: string;
}

interface PokemonState {
  list: Pokemon[];
  pokedex: PokedexItem[];
  pendingOperations: PendingOperation[];
  lastSync: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: PokemonState = {
  list: [],
  pokedex: [],
  pendingOperations: [],
  lastSync: null,
  loading: false,
  error: null,
};

export const syncPendingOperations = createAsyncThunk(
  "pokemon/syncPendingOperations",
  async (_, { getState }) => {
    const state = getState() as { pokemon: PokemonState };
    const { pendingOperations } = state.pokemon;

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return pendingOperations;
  }
);

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

      state.pendingOperations.push({
        type: 'add',
        payload: action.payload,
        timestamp: Date.now(),
        id: `add_${action.payload.id}_${Date.now()}`
      });
    },
    
    removeFromPokedex: (state, action: PayloadAction<string>) => {
      const existingItem = state.pokedex.find(item => item.pokemon.id === action.payload);
      
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.pokedex = state.pokedex.filter(item => item.pokemon.id !== action.payload);
        }

        if (existingItem) {
          state.pendingOperations.push({
            type: 'remove',
            payload: action.payload,
            timestamp: Date.now(),
            id: `remove_${action.payload}_${Date.now()}`
          });
        }
      }
    },
    
    removeAllFromPokedex: (state, action: PayloadAction<string>) => {
      const itemToRemove = state.pokedex.find(item => item.pokemon.id === action.payload);
      state.pokedex = state.pokedex.filter(item => item.pokemon.id !== action.payload);
      
      if (itemToRemove) {
        state.pendingOperations.push({
          type: 'removeAll',
          payload: action.payload,
          timestamp: Date.now(),
          id: `removeAll_${action.payload}_${Date.now()}`
        });
      }
    },
    
    clearPokedex: (state) => {
      if (state.pokedex.length > 0) {
        state.pendingOperations.push({
          type: 'clear',
          payload: state.pokedex.map(item => item.pokemon.id),
          timestamp: Date.now(),
          id: `clear_${Date.now()}`
        });
      }
      
      state.pokedex = [];
    },
    
    updatePokedexQuantity: (state, action: PayloadAction<{pokemonId: string, quantity: number}>) => {
      const { pokemonId, quantity } = action.payload;
      const existingItem = state.pokedex.find(item => item.pokemon.id === pokemonId);
      
      if (existingItem) {
        const oldQuantity = existingItem.quantity;
        
        if (quantity <= 0) {
          state.pokedex = state.pokedex.filter(item => item.pokemon.id !== pokemonId);
        } else {
          existingItem.quantity = quantity;
        }

        state.pendingOperations.push({
          type: 'update',
          payload: { pokemonId, oldQuantity, newQuantity: quantity },
          timestamp: Date.now(),
          id: `update_${pokemonId}_${Date.now()}`
        });
      }
    },
    
    swapPokedexItems: (state, action: PayloadAction<{fromIndex: number, toIndex: number}>) => {
      const { fromIndex, toIndex } = action.payload;
      const items = [...state.pokedex];
      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
      state.pokedex = items;
    },

    clearPendingOperations: (state) => {
      state.pendingOperations = [];
      state.lastSync = Date.now();
    },

    restorePendingOperations: (state, action: PayloadAction<PendingOperation[]>) => {
      state.pendingOperations = action.payload;
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
      })
      .addCase(syncPendingOperations.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncPendingOperations.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingOperations = [];
        state.lastSync = Date.now();
      })
      .addCase(syncPendingOperations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error sincronizando operaciones";
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

export const selectPendingOperations = (state: { pokemon: PokemonState }) => 
  state.pokemon.pendingOperations;

export const selectLastSync = (state: { pokemon: PokemonState }) => 
  state.pokemon.lastSync;

export const { 
  addToPokedex, 
  removeFromPokedex, 
  removeAllFromPokedex, 
  clearPokedex,
  updatePokedexQuantity,
  swapPokedexItems,
  clearPendingOperations,
  restorePendingOperations
} = pokemonSlice.actions;

export default pokemonSlice.reducer;