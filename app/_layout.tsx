import '../global.css';
import { Stack } from 'expo-router';
import { FavoritesProvider } from '../lib/context/FavoritesContext';

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </FavoritesProvider>
  );
}
