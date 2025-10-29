import { Stack } from 'expo-router';
import { FavoritesProvider } from '../lib/context/FavoritesContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="pokemon/[id]" />
        </Stack>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}