import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { useState, useEffect } from 'react';
import pokeApi from '../../lib/pokeApi';

export default function PokemonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    const fetchPokemon = async () => {
      try {
        const { data } = await pokeApi.get(`/pokemon/${id}`);
        setPokemon(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <Text className="text-red-500">Pokémon no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="items-center p-6">
        <Link href="/(tabs)" className="self-start ml-4 mt-4">
          <Text className="text-blue-500">← Volver</Text>
        </Link>
        <Image
          source={{ uri: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default }}
          className="w-48 h-48"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold capitalize mt-4 text-gray-900 dark:text-white">
          {pokemon.name}
        </Text>
        <Text className="text-lg text-gray-500 dark:text-gray-400">
          #{String(pokemon.id).padStart(3, '0')}
        </Text>

        <View className="flex-row mt-4">
          {pokemon.types.map((t: any) => (
            <Text key={t.slot} className="mx-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm capitalize">
              {t.type.name}
            </Text>
          ))}
        </View>

        <View className="mt-8 w-full px-6">
          <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Estadísticas</Text>
          {pokemon.stats.map((s: any) => (
            <View key={s.stat.name} className="flex-row justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <Text className="capitalize text-gray-700 dark:text-gray-300">
                {s.stat.name.replace('-', ' ')}
              </Text>
              <Text className="font-bold text-gray-900 dark:text-white">{s.base_stat}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}