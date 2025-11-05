import NetInfo from '@react-native-community/netinfo';

export const checkNetworkConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  } catch (error) {
    console.error('Network check failed:', error);
    return false;
  }
};

export const subscribeToNetworkChanges = (callback) => {
  return NetInfo.addEventListener(state => {
    callback(state.isConnected && state.isInternetReachable);
  });
};