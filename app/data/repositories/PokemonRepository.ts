import { PokemonApi } from "../datasources/PokemonApi";

export class PokemonRepository {
  private api: PokemonApi;

  constructor() {
    this.api = new PokemonApi();
  }

  async getPokemons(limit = 20, offset = 0) {
    return this.api.getPokemons(limit, offset);
  }
}
