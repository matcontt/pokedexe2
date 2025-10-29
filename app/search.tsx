import { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { usePokemon } from '../lib/hooks/usePokemon';
import PokemonCard from '../components/PokemonCard';
import TextField from '../components/TextField';

export default function Search() {
  const { pokemon, loading } = usePokemon();
  const [search, setSearch] = useState('');

  // Filtrado en tiempo real (insensible a mayúsculas)
  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Input de búsqueda */}
      <View className="p-4 bg-white shadow-sm">
        <TextField
          placeholder="Buscar Pokémon..."
          value={search}
          onChangeText={setSearch}
          className="bg-gray-100 rounded-xl px-4 py-3 text-base"
        />
      </View>

      {/* Lista filtrada */}
      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerClassName="p-2"
        ListEmptyComponent={
          !loading && search ? (
            <View className="flex-1 items-center mt-10">
              <Text className="text-gray-500 text-lg">
                No se encontró "{search}"
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}