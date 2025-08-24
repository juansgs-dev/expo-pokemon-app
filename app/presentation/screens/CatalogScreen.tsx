import React, { useCallback, useEffect, useState } from "react";
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
  const [hasMore, setHasMore] = useState(true); // ⚡ para saber si hay más Pokémon

  const fetchPokemons = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const newPokemons = await repository.getPokemons(20, offset);

      if (newPokemons.length === 0) {
        setHasMore(false); // no hay más Pokémon
      } else {
        setPokemons((prev) => {
          const updated = [...prev, ...newPokemons].filter(
            (p, index, self) =>
              index === self.findIndex((obj) => obj.id === p.id)
          );
          console.log("Pokémons cargados:", updated.length);
          return updated;
        });

        setOffset((prev) => prev + 20);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }, [offset, loading, hasMore]);

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
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        onEndReached={fetchPokemons}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <PokemonCard
            id={item.id}
            name={item.name}
            image={item.image}
            types={item.types}
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
