import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PokemonRepository } from "../../data/repositories/PokemonRepository";
import PokemonCard from "../components/PokemonCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

const repository = new PokemonRepository();

export default function PokemonList() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);

  const fetchPokemons = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await repository.getPokemons(20, offset);

      const newPokemons = res.results.map((p) => ({
        name: p.name,
        url: p.url,
        price: (Math.random() * 100).toFixed(2),
      }));

      setPokemons((prev) =>
        [...prev, ...newPokemons].filter(
          (p, index, self) =>
            index === self.findIndex((obj) => obj.url === p.url)
        )
      );

      setOffset((prev) => prev + 20);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const addToCart = (pokemon: any) => {
    setCart((prev) => [...prev, pokemon]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        data={pokemons}
        keyExtractor={(item) => {
          const id = item.url.split("/").filter(Boolean).pop();
          return `pokemon-${id}`;
        }}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        onEndReached={fetchPokemons}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <PokemonCard
            name={item.name}
            url={item.url}
            price={item.price}
            width={CARD_WIDTH}
            onAdd={() => addToCart(item)}
          />
        )}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color="#000" className="my-4" />
          ) : null
        }
      />
    </SafeAreaView>
  );
}
