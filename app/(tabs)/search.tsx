import { useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { usePokemon } from '../../lib/hooks/usePokemon';
import { useFavorites } from '../../lib/context/FavoritesContext';
import PokemonCard from '../../components/PokemonCard';
import TextField from '../../components/TextField';

export default function Search() {
  const { pokemon, loading, loadingMore, loadMore, reload } = usePokemon();
  const { favorites } = useFavorites();
  const [search, setSearch] = useState('');

  const filteredPokemon = pokemon.filter(p => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return p.name.toLowerCase().includes(query) || p.types.some(t => t.toLowerCase().includes(query));
  });

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="p-4 bg-white dark:bg-gray-800">
        <TextField placeholder="Buscar por nombre o tipo..." value={search} onChangeText={setSearch} icon={true} />
      </View>

      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={{ padding: 8 }}
        onEndReached={() => search === '' && loadMore()}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore && search === '' ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size={30} color="#dc2626" />
            </View>
          ) : null
        }
        refreshing={loading}
        onRefresh={reload}
        ListEmptyComponent={
          !loading && search && filteredPokemon.length === 0 ? (
            <View className="flex-1 items-center mt-10">
              <Text className="text-lg text-gray-500 dark:text-gray-400">
                No se encontró "{search}"
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}