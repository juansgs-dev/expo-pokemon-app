import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
  types: string[];
  width: number;
  onAdd: () => void;
};

const typeColors: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function PokemonCard({ id, name, image, types, width, onAdd }: Props) {
  const [imgLoading, setImgLoading] = useState(true);

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

      {/* ID */}
      <Text style={styles.id}>#{id}</Text>

      {/* Name */}
      <Text style={styles.name}>{name}</Text>

      {/* Types */}
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

      <TouchableOpacity
        style={styles.button}
        onPress={onAdd}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons
            name="pokeball"
            size={24}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Agregar</Text>
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
  id: {
    fontSize: 12,
    fontWeight: "700",
    color: darkTheme.secondary,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
    color: darkTheme.text,
    marginBottom: 6,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 2,
    marginBottom: 4,
  },
  typeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    textTransform: "capitalize",
  },
  button: {
    backgroundColor: darkTheme.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20, 
    alignSelf: "stretch",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
