import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-3xl font-bold text-red-600">Pokédex</Text>
      <Text className="mt-2 text-gray-600">Inicializando...</Text>
    </View>
  );
}