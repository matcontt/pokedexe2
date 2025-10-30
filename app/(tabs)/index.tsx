import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { usePokemon } from '../../lib/hooks/usePokemon';
import PokemonCard from '../../components/PokemonCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

const pokemonTypes = [
  { name: 'fire', emoji: '🔥', color: '#F08030' },
  { name: 'water', emoji: '💧', color: '#6890F0' },
  { name: 'grass', emoji: '🌿', color: '#78C850' },
  { name: 'electric', emoji: '⚡', color: '#F8D030' },
  { name: 'psychic', emoji: '🔮', color: '#F85888' },
  { name: 'dragon', emoji: '🐉', color: '#7038F8' },
  { name: 'dark', emoji: '🌙', color: '#705848' },
  { name: 'fairy', emoji: '✨', color: '#EE99AC' },
];

export default function Home() {
  const { pokemon, loading, loadingMore, error, loadMore, reload } = usePokemon();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredPokemon = selectedType
    ? pokemon.filter(p => p.types.includes(selectedType))
    : pokemon;

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
        data={filteredPokemon}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 20, paddingTop: 8 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        onEndReached={() => !selectedType && loadMore()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore && !selectedType ? (
            <View className="py-5">
              <ActivityIndicator size={30} color="#dc2626" />
            </View>
          ) : null
        }
        refreshing={loading}
        onRefresh={reload}
        ListHeaderComponent={
          <View className="mb-4 bg-white p-4 rounded-xl mx-2 shadow-sm">
            <Text className="text-lg font-extrabold text-gray-800 mb-3">
              🎯 Filtrar por Tipo
            </Text>
            
            {/* Botón para mostrar todos */}
            <View className="mb-3">
              <TouchableOpacity
                onPress={() => setSelectedType(null)}
                className={`px-4 py-2 rounded-xl ${
                  selectedType === null ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`text-center font-bold ${
                    selectedType === null ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  Ver Todos
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tipos de Pokémon */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {pokemonTypes.map((type) => {
                const count = pokemon.filter(p => p.types.includes(type.name)).length;
                const isSelected = selectedType === type.name;
                
                return (
                  <TouchableOpacity
                    key={type.name}
                    onPress={() => setSelectedType(type.name)}
                    className="mr-3 rounded-xl overflow-hidden"
                    style={{
                      backgroundColor: isSelected ? type.color : '#f3f4f6',
                      minWidth: 100,
                    }}
                  >
                    <View className="p-3 items-center">
                      <Text className="text-2xl mb-1">{type.emoji}</Text>
                      <Text
                        className={`text-sm font-bold capitalize ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {type.name}
                      </Text>
                      <Text
                        className={`text-xs ${
                          isSelected ? 'text-white/80' : 'text-gray-500'
                        }`}
                      >
                        {count} Pokémon
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {selectedType && (
              <View className="mt-3 bg-red-50 p-2 rounded-lg">
                <Text className="text-sm text-red-600 text-center font-semibold">
                  Mostrando {filteredPokemon.length} Pokémon de tipo {selectedType}
                </Text>
              </View>
            )}
          </View>
        }
      />
    </View>
  );
}