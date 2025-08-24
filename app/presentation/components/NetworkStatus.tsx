import { useNetInfo } from '@react-native-community/netinfo';
import { FC, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const NetworkStatus: FC = () => {
  const netInfo = useNetInfo();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const isOnline = netInfo.isConnected && netInfo.isInternetReachable;
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (wasOffline.current) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
        wasOffline.current = false;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, fadeAnim]);

  if (isOnline && !wasOffline.current) return null;

  return (
     <Animated.View style={[
    styles.container,
    !isOnline ? styles.offlineContainer : styles.onlineContainer,
    { opacity: fadeAnim }
  ]}>
      <Text style={styles.text}>
        {!isOnline ? 'Modo sin conexión' : 'Conexión restaurada'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  offlineContainer: {
    backgroundColor: '#ff9500',
  },
  onlineContainer: {
    backgroundColor: '#4cd964',
  },
  text: {
    fontWeight: 'bold',
  },
  offlineText: {
    color: '#fff',
  },
  onlineText: {
    color: '#fff',
  },
});

export default NetworkStatus;