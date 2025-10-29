import { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { usePokemon } from '../lib/hooks/usePokemon';
import PokemonCard from '../components/PokemonCard';
import TextField from '../components/TextField';

export default function Search() {
  const { pokemon, loading } = usePokemon();
  const [search, setSearch] = useState('');

  // BÚSQUEDA POR NOMBRE O TIPO (insensible a mayúsculas)
  const filteredPokemon = pokemon.filter((p) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;

    const nameMatch = p.name.toLowerCase().includes(query);
    const typeMatch = p.types.some((t) => t.toLowerCase().includes(query));

    return nameMatch || typeMatch;
  });

  return (
    <View className="flex-1 bg-gray-100">
      {/* INPUT CON ÍCONO */}
      <View className="p-4 bg-white shadow-sm">
        <TextField
          placeholder="Buscar por nombre o tipo..."
          value={search}
          onChangeText={setSearch}
          icon={true}
        />
      </View>

      {/* LISTA FILTRADA */}
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