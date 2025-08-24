import { Pokemon } from "@/app/domain/entities/Pokemon";
import { PokemonApi } from "../datasources/PokemonApi";

export class PokemonRepository {
  private api: PokemonApi;

  constructor() {
    this.api = new PokemonApi();
  }

  async getPokemons(limit = 20, offset = 0): Promise<Pokemon[]> {
    const response = await this.api.getPokemons(limit, offset);

    const pokemons = await Promise.all(
      response.results.map(async (p) => {

        const pokeDetails = await this.api.getPokemonByUrl(p.url);

        const types = pokeDetails.types.map((t: any) => t.type.name);

        const id = p.url.split("/").filter(Boolean).pop();

        return {
          id: id || "0",
          name: p.name,
          image: `${process.env.EXPO_PUBLIC_IMG_URL}${id}.png`,
          types,
        };
      })
    );

    return pokemons;
  }
}
