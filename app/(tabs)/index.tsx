import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { usePokemon } from '../../lib/hooks/usePokemon';
import { useFavorites } from '../../lib/hooks/useFavorites';
import PokemonCard from '../../components/PokemonCard';

export default function Home() {
  const { pokemon, loading, loadingMore, error, loadMore, reload } = usePokemon();
  const { favorites } = useFavorites();

  // Filtrar favoritos
  const favoritePokemon = pokemon.filter(p => favorites.includes(p.id));

  if (loading && pokemon.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900">
        <ActivityIndicator size={40} color="#dc2626" />
        <Text className="mt-4 text-gray-600 dark:text-gray-300">Cargando Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-900">
        <Text className="text-red-500 dark:text-red-400">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* HEADER */}
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

        // SECCIÓN DE FAVORITOS (OPCIONAL)
        ListHeaderComponent={
          favoritePokemon.length > 0 ? (
            <View className="mb-4">
              <Text className="text-lg font-bold text-gray-800 dark:text-white px-4 mb-2">
                Tus favoritos
              </Text>
              <FlatList
                data={favoritePokemon}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `fav-${item.id}`}
                renderItem={({ item }) => (
                  <View className="mr-2">
                    <PokemonCard pokemon={item} />
                  </View>
                )}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}