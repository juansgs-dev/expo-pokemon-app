import typeColors from '@/app/helpers/colorTypes';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { darkTheme } from "../../theme/colors";

type Props = {
  id: string;
  name: string;
  image: string;
  price: number;
  types: string[];
  width: number;
  onAdd: () => void;
};

export default function PokemonCard({ id, name, image, price, types, width, onAdd }: Props) {
  const [imgLoading, setImgLoading] = useState(true);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.imageWrap}>
        {imgLoading && (
          <ActivityIndicator style={StyleSheet.absoluteFillObject} />
        )}
        <Image
          source={{ uri: image }}
          style={styles.image}
          onLoadEnd={() => setImgLoading(false)}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.id}>#{id}</Text>

        <Text style={styles.name}>{name}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${price}</Text>
        </View>

        <View style={styles.typesContainer}>
          {types.map((type) => (
            <View
              key={type}
              style={[styles.typeBadge, { backgroundColor: typeColors[type] || "#777" }]}
            >
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onAdd}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={[styles.pokedexButtonWrapper, isPressed && styles.buttonPressed]}
      >
        <View style={styles.pokedexButtonOuter}>
          <LinearGradient
            colors={["#EE1515", "#fff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1.8 }}
            style={styles.pokedexButton}
          >
            <View style={styles.pokedexButtonInner}>
              <MaterialCommunityIcons
                name="pokeball"
                size={20}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.pokedexButtonText}>Agregar</Text>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
   card: {
    margin: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: darkTheme.card,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
    width: "88%",
    height: "88%",
    resizeMode: "contain",
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  id: {
    fontSize: 12,
    color: darkTheme.secondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceContainer: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  pokedexButtonWrapper: {
    marginTop: 'auto',
  },
  pokedexButtonOuter: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  pokedexButton: {
    padding: 2,
  },
  pokedexButtonInner: {
    backgroundColor: '#EE1515',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 23,
  },
  pokedexButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
});