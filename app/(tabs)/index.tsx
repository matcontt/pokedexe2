import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { usePokemon } from '../../lib/hooks/usePokemon';
import { useFavorites } from '../../lib/context/FavoritesContext';
import PokemonCard from '../../components/PokemonCard';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const { pokemon, loading, loadingMore, error, loadMore, reload } = usePokemon();
  const { favorites } = useFavorites();

  const favoritePokemon = pokemon.filter(p => favorites.includes(p.id));

  if (loading && pokemon.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size={50} color="#dc2626" />
        <Text className="mt-4 text-gray-600 text-base">Cargando Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-base">Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#dc2626', '#b91c1c']}
        className="py-6 px-5 pt-12 items-center"
      >
        <Text className="text-white text-3xl font-extrabold">Pokédex</Text>
        <Text className="text-white/90 text-sm mt-1">
          {pokemon.length} Pokémon descubiertos
        </Text>
      </LinearGradient>

      <FlatList
        data={pokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 20, paddingTop: 8 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-5">
              <ActivityIndicator size={30} color="#dc2626" />
            </View>
          ) : null
        }
        refreshing={loading}
        onRefresh={reload}
        ListHeaderComponent={
          favoritePokemon.length > 0 ? (
            <View className="mb-4 bg-white p-3 rounded-xl mx-2 shadow-sm">
              <Text className="text-lg font-extrabold text-gray-800 mb-3">
                ⭐ Tus Favoritos
              </Text>
              <FlatList
                data={favoritePokemon.slice(0, 5)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `fav-${item.id}`}
                renderItem={({ item }) => (
                  <View className="mr-2 w-36">
                    <PokemonCard pokemon={item} />
                  </View>
                )}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}