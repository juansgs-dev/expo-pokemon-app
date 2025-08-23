import React from "react";
import { Provider } from "react-redux";
import CatalogScreen from "./presentation/screens/CatalogScreen";
import { store } from "./presentation/store";

const RootLayout = () => {
  return (
    <Provider store={store}>
        <CatalogScreen />
    </Provider>
  );
};

export default RootLayout;
