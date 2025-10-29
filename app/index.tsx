import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { usePokemon } from '../lib/hooks/usePokemon';
import PokemonCard from '../components/PokemonCard';

export default function Home() {
  const { pokemon, loading, error, reload } = usePokemon();

  if (loading && pokemon.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#dc2626" />
        <Text className="mt-4 text-gray-600">Cargando Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-red-600 p-6 items-center">
        <Text className="text-white text-3xl font-bold">Pokédex</Text>
      </View>
      <FlatList
        data={pokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerClassName="p-2"
        refreshing={loading}
        onRefresh={reload}
      />
    </View>
  );
}