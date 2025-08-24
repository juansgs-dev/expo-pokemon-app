import { PokedexItem } from "./PokedexItem";
import { Pokemon } from "./Pokemon";

export interface PokemonState {
  list: Pokemon[];
  pokedex: PokedexItem[];
  loading: boolean;
  error: string | null;
}