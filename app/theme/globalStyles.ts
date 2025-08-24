import { StyleSheet } from "react-native";
import { darkTheme } from "./colors";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
    padding: 16,
  },
  card: {
    backgroundColor: darkTheme.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  title: {
    color: darkTheme.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: darkTheme.textSecondary,
    fontSize: 14,
  },
  button: {
    backgroundColor: darkTheme.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: darkTheme.text,
    fontWeight: "bold",
    fontSize: 16,
  },
});
