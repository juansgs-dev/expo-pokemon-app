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

        const stats = this.extractStats(pokeDetails.stats);
        
        const id = p.url.split("/").filter(Boolean).pop();

        return {
          id: id || "0",
          name: p.name,
          price: this.calculatePriceBasedOnStats(stats),
          image: `${process.env.EXPO_PUBLIC_IMG_URL}${id}.png`,
          types,
          hp: stats.hp,
          attack: stats.attack,
          defense: stats.defense,
          speed: stats.speed,
        };
      })
    );

    return pokemons;
  }

  private extractStats(statsData: any[]): {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  } {
    const stats: any = {};
    
    statsData.forEach((stat: any) => {
      const statName = stat.stat.name;
      stats[statName] = stat.base_stat;
    });

    return {
      hp: stats.hp || 0,
      attack: stats.attack || 0,
      defense: stats.defense || 0,
      specialAttack: stats['special-attack'] || 0,
      specialDefense: stats['special-defense'] || 0,
      speed: stats.speed || 0,
    };
  }

  private calculatePriceBasedOnStats(stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  }): number {
    const basePrice = 10;
    const totalStats = stats.hp + stats.attack + stats.defense + 
                      stats.specialAttack + stats.specialDefense + stats.speed;
    
    return basePrice + Math.floor(totalStats / 10);
  }
}
