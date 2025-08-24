import { FC } from "react";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from "./presentation/components/AppNavigator";
import NetworkStatus from "./presentation/components/NetworkStatus";
import { useAutoSync } from "./presentation/hooks/useAutoSync";
import { persistor, store } from "./presentation/store";

const AppContent: FC = () => {
  useAutoSync();
  
  return (
    <>
      <AppNavigator />
      <NetworkStatus />
    </>
  );
};

const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;