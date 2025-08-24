import axios from "axios";

export interface PokemonListResponse {
  results: {
    name: string;
    url: string;
  }[];
}

export class PokemonApi {
  private baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  async getPokemons(limit = 20, offset = 0): Promise<PokemonListResponse> {
    const response = await axios.get<PokemonListResponse>(
      `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }

  async getPokemonByUrl(url: string): Promise<any> {
    const response = await axios.get(url);
    return response.data;
  }
}
