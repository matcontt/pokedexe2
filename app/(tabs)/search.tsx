import { useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { usePokemon } from '../../lib/hooks/usePokemon';
import PokemonCard from '../../components/PokemonCard';
import TextField from '../../components/TextField';

export default function Search() {
  const { pokemon, loading, loadingMore, loadMore, reload } = usePokemon();
  const [search, setSearch] = useState('');

  const filteredPokemon = pokemon.filter(p => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return p.name.toLowerCase().includes(query) || p.types.some(t => t.toLowerCase().includes(query));
  });

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-4 pt-12 border-b border-gray-200">
        <Text className="text-2xl font-extrabold text-gray-800 mb-4">
          Buscar Pokémon
        </Text>
        <TextField 
          placeholder="Buscar por nombre o tipo..." 
          value={search} 
          onChangeText={setSearch} 
          icon={true} 
        />
      </View>

      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 20, paddingTop: 8 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        onEndReached={() => search === '' && loadMore()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore && search === '' ? (
            <View className="py-5">
              <ActivityIndicator size={30} color="#dc2626" />
            </View>
          ) : null
        }
        refreshing={loading}
        onRefresh={reload}
        ListEmptyComponent={
          !loading && search && filteredPokemon.length === 0 ? (
            <View className="flex-1 items-center mt-16 px-6">
              <Text className="text-6xl mb-4">🔍</Text>
              <Text className="text-xl font-bold text-gray-500 mb-2">
                No se encontraron resultados
              </Text>
              <Text className="text-sm text-gray-400 text-center">
                No hay Pokémon que coincidan con "{search}"
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}