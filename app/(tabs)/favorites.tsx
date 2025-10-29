import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { usePokemon } from '../../lib/hooks/usePokemon';
import { useFavorites } from '../../lib/context/FavoritesContext';
import PokemonCard from '../../components/PokemonCard';

export default function Favorites() {
  const { pokemon, loading, reload } = usePokemon();
  const { favorites } = useFavorites();

  const favoritePokemon = pokemon.filter(p => favorites.includes(p.id));

  return (
    <View className="flex-1 bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">Mis Favoritos</Text>
      </View>

      <FlatList
        data={favoritePokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={loading}
        onRefresh={reload}
        ListEmptyComponent={
          !loading && favoritePokemon.length === 0 ? (
            <View className="flex-1 items-center justify-center mt-20 px-6">
              <Text className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                No tienes favoritos
              </Text>
              <Text className="text-center text-gray-400 dark:text-gray-500 mt-2">
                Toca el corazón en cualquier Pokémon
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}