import typeColors from '@/app/helpers/colorTypes';
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from 'react-redux';
import { PokemonRepository } from "../../data/repositories/PokemonRepository";
import PokemonCard from "../components/PokemonCard";
import { addToPokedex } from '../store/pokemonSlice';

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

const repository = new PokemonRepository();
const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
  "dragon", "dark", "steel", "fairy"
];

export default function PokemonList() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"id" | "name_asc" | "name_desc" | "type">("id");

  const dispatch = useDispatch();

  const fetchPokemons = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const newPokemons = await repository.getPokemons(20, offset);
      if (newPokemons.length === 0) {
        setHasMore(false);
      } else {
        setPokemons((prev) => {
          const updated = [...prev, ...newPokemons].filter(
            (p, index, self) => index === self.findIndex((obj) => obj.id === p.id)
          );
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

  const handleAdd = (pokemon: any) => {
    dispatch(addToPokedex(pokemon));
  };

  const filteredPokemons = pokemons
    .filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter(p => typeFilter ? p.types.includes(typeFilter) : true)
    .sort((a, b) => {
      switch (sortBy) {
        case "name_asc": return a.name.localeCompare(b.name);
        case "name_desc": return b.name.localeCompare(a.name);
        case "type": return a.types[0].localeCompare(b.types[0]);
      }
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0d1117" }}>

      <TextInput
        placeholder="Buscar Pokémon..."
        value={searchText}
        onChangeText={setSearchText}
        style={{
          margin: 10,
          padding: 10,
          borderRadius: 12,
          backgroundColor: "#fff",
        }}
      />

      <View style={{
        flexDirection: 'row',
        marginHorizontal: 10,
        marginBottom: 10,
        gap: 8,
      }}>

        <View style={{
          flex: 1,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#1f1f1f',
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 6,
          elevation: 4,
        }}>
          <Picker
            selectedValue={typeFilter}
            onValueChange={(itemValue) => setTypeFilter(itemValue)}
            style={{
              backgroundColor: typeFilter ? typeColors[typeFilter] : '#333',
              color: '#fff',
              fontSize: 12,
            }}
            itemStyle={{ color: '#fff', fontSize: 12 }}
          >

            <Picker.Item label="Todos los tipos" value={null} />

            {TYPES.map((type) => (
              <Picker.Item
                key={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                value={type}
              />
            ))}
          </Picker>
        </View>

        <View style={{
          flex: 1,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#1f1f1f',
        }}>
          <Picker
            selectedValue={sortBy}
            onValueChange={(value) => setSortBy(value)}
            style={{ color: '#fff', fontSize: 12 }}
            itemStyle={{ color: '#fff', fontSize: 12 }}
          >
            <Picker.Item label="ID" value="id" />
            <Picker.Item label="Nombre A-Z" value="name_asc" />
            <Picker.Item label="Nombre Z-A" value="name_desc" />
            <Picker.Item label="Tipo" value="type" />
          </Picker>
        </View>
      </View>


      <FlatList
        data={filteredPokemons}
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
            price={item.price}
            types={item.types}
            width={CARD_WIDTH}
            onAdd={() => handleAdd(item)}
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
