import { View, Text, FlatList, ActivityIndicator } from 'react-native'; // AÑADE AQUÍ
import { usePokemon } from '../../lib/hooks/usePokemon';
import PokemonCard from '../../components/PokemonCard';

export default function Home() {
  const { pokemon, loading, loadingMore, error, loadMore, reload } = usePokemon();

  if (loading && pokemon.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900">
        <ActivityIndicator size={40} color="#dc2626" />
        <Text className="mt-4 text-gray-600 dark:text-gray-300">Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="bg-red-600 dark:bg-red-800 p-6 items-center">
        <Text className="text-white text-3xl font-bold">Pokédex</Text>
      </View>

      <FlatList
        data={pokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={{ padding: 8 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size={30} color="#dc2626" />
            </View>
          ) : null
        }
        refreshing={loading}
        onRefresh={reload}
      />
    </View>
  );
}