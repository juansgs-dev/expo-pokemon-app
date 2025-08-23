import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  name: string;
  url: string;
  price: string;
  width: number;
  onAdd: () => void;
};

export default function PokemonCard({ name, url, price, width, onAdd }: Props) {
  const id = getIdFromUrl(url);
  const image = getArtworkUrl(id);
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
        <View style={styles.badge}>
          <Text style={styles.badgeText}>#{id}</Text>
        </View>
      </View>

      <Text style={styles.name}>{name}</Text>

      {/* 👇 Nuevo precio */}
      <Text style={styles.price}>${price}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onAdd}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

function getIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? Number(match[1]) : 0;
}
function getArtworkUrl(id: number) {
  return `${process.env.EXPO_PUBLIC_IMG_URL}${id}.png`;
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: "88%",
    height: "88%",
    resizeMode: "contain",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#111827",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    opacity: 0.9,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
    color: "#111827",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "stretch",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
  },
});
