import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react';
import { useStore } from '../src/context/StoreContext';

const DashboardScreen = observer(() => {
  const router = useRouter();
  const { authStore } = useStore();

  const handleLogout = async () => {
    await authStore.logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default DashboardScreen;
