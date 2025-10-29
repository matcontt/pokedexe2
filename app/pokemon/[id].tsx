import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import pokeApi from '../../lib/pokeApi';

export default function PokemonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const { data } = await pokeApi.get(`/pokemon/${id}`);
        setPokemon(data);
      } catch (err) {
        console.error('Error al cargar el Pokémon:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#dc2626" />
        <Text className="mt-4 text-gray-600">Cargando...</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Pokémon no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center p-6">
        {/* Imagen oficial (mejor calidad) */}
        <Image
          source={{
            uri:
              pokemon.sprites.other?.['official-artwork']?.front_default ||
              pokemon.sprites.front_default,
          }}
          className="w-48 h-48"
          resizeMode="contain"
        />

        {/* Nombre y número */}
        <Text className="text-3xl font-bold capitalize mt-4">{pokemon.name}</Text>
        <Text className="text-gray-500 text-lg">
          #{String(pokemon.id).padStart(3, '0')}
        </Text>

        {/* Tipos */}
        <View className="flex-row mt-4">
          {pokemon.types.map((t: any) => (
            <Text
              key={t.slot}
              className="mx-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm capitalize"
            >
              {t.type.name}
            </Text>
          ))}
        </View>

        {/* Estadísticas */}
        <View className="mt-8 w-full px-6">
          <Text className="text-lg font-semibold mb-3">Estadísticas</Text>
          {pokemon.stats.map((s: any) => (
            <View
              key={s.stat.name}
              className="flex-row justify-between py-2 border-b border-gray-200"
            >
              <Text className="capitalize text-gray-700">
                {s.stat.name.replace('-', ' ')}
              </Text>
              <Text className="font-bold text-gray-900">{s.base_stat}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}