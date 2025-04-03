import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { observer } from 'mobx-react';
import { useStore } from '../src/context/StoreContext';
import { View, ActivityIndicator } from 'react-native';

const Index = observer(() => {
  const { authStore } = useStore();

  if (authStore.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return authStore.isLoggedIn ? <Redirect href="/dashboard" /> : <Redirect href="/login" />;
});

export default Index;
