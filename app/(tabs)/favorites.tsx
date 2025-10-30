import { View, Text, FlatList } from 'react-native';
import { usePokemon } from '../../lib/hooks/usePokemon';
import { useFavorites } from '../../lib/context/FavoritesContext';
import PokemonCard from '../../components/PokemonCard';

export default function Favorites() {
  const { pokemon, loading, reload } = usePokemon();
  const { favorites } = useFavorites();

  const favoritePokemon = pokemon.filter(p => favorites.includes(p.id));

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-5 pt-12 border-b border-gray-200">
        <Text className="text-3xl font-extrabold text-gray-800">
          ❤️ Mis Favoritos
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          {favoritePokemon.length} Pokémon guardados
        </Text>
      </View>

      <FlatList
        data={favoritePokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 20, paddingTop: 8 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        refreshing={loading}
        onRefresh={reload}
        ListEmptyComponent={
          !loading ? (
            <View className="flex-1 items-center justify-center mt-20 px-8">
              <Text className="text-8xl mb-5">💔</Text>
              <Text className="text-2xl font-bold text-gray-500 mb-2">
                No tienes favoritos
              </Text>
              <Text className="text-base text-gray-400 text-center leading-6">
                Toca el corazón en cualquier Pokémon para agregarlo a tus favoritos
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
