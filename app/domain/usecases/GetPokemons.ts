import { PokemonRepository } from "../../data/repositories/PokemonRepository";

export class GetPokemons {
  private repository: PokemonRepository;

  constructor() {
    this.repository = new PokemonRepository();
  }

  async execute(limit = 20, offset = 0) {
    return this.repository.getPokemons(limit, offset);
  }
}
