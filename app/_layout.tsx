import React from "react";
import { Provider } from "react-redux";
import { store } from "./presentation/store";

import AppNavigator from "./presentation/components/AppNavigator";

const RootLayout = () => {
  return (
    <Provider store={store}>
          <AppNavigator />
    </Provider>
  );
};

export default RootLayout;
