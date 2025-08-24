import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { syncPendingOperations } from '../store/pokemonSlice';

export const useAutoSync = () => {
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const { pendingOperations } = useSelector((state: RootState) => state.pokemon);

  const isOnline = netInfo.isConnected && netInfo.isInternetReachable;

  useEffect(() => {
    if (isOnline && pendingOperations.length > 0) {
      dispatch(syncPendingOperations() as any);
    }
  }, [isOnline, pendingOperations.length, dispatch]);
};