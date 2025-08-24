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
  types: string[];
  width: number;
  onAdd: () => void;
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

      <Text style={styles.id}>#{id}</Text>

      <Text style={styles.name}>{name}</Text>

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
        activeOpacity={0.8}
        onPress={onAdd}
        style={styles.buttonWrapper}
      >
        <LinearGradient
          colors={["#EE1515", "#fff"]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1.8 }}
          style={styles.buttonGradient}
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
        </LinearGradient>
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
  buttonWrapper: {
    borderRadius: 25,
    overflow: "hidden",
    alignSelf: "stretch",
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
