import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import CatalogScreen from "./presentation/screens/CatalogScreen";
import { store } from "./presentation/store";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <CatalogScreen />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d1117",
  },
});

export default RootLayout;