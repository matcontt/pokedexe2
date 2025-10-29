import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import pokeApi from '../../lib/pokeApi';
import { useFavorites } from '../../lib/context/FavoritesContext';
import { Heart } from 'lucide-react-native';

export default function PokemonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<any>(null);
  const [species, setSpecies] = useState<any>(null);
  const [evolutionChain, setEvolutionChain] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Animación del corazón
  const scale = useRef(new Animated.Value(1)).current;

  const handleFavorite = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    toggleFavorite(pokemon.id);
  };

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchAll = async () => {
      try {
        const { data: pokeData } = await pokeApi.get(`/pokemon/${id}`);
        const { data: speciesData } = await pokeApi.get(
          pokeData.species.url.replace('https://pokeapi.co/api/v2', '')
        );
        const { data: evolutionData } = await pokeApi.get(
          speciesData.evolution_chain.url.replace('https://pokeapi.co/api/v2', '')
        );

        // Cadena de evolución
        const chain: any[] = [];
        let current = evolutionData.chain;
        while (current) {
          const name = current.species.name;
          const evoId = current.species.url.split('/').slice(-2, -1)[0];
          chain.push({ name, id: evoId });
          current = current.evolves_to[0];
        }

        setPokemon(pokeData);
        setSpecies(speciesData);
        setEvolutionChain(chain);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <ActivityIndicator size={60} color="#dc2626" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <Text className="text-red-500 text-xl">Pokémon no encontrado</Text>
      </View>
    );
  }

  const favorite = isFavorite(pokemon.id);

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <View className="p-6">
        <Link href="/(tabs)" className="mb-4">
          <Text className="text-blue-600 dark:text-blue-400 font-semibold">
            ← Volver
          </Text>
        </Link>

        <View className="items-center relative">
          <Image
            source={{
              uri:
                pokemon.sprites.other?.['official-artwork']?.front_default ||
                pokemon.sprites.front_default,
            }}
            className="w-80 h-80"
            resizeMode="contain"
          />
          <Text className="text-5xl font-bold capitalize mt-4 text-gray-900 dark:text-white">
            {pokemon.name}
          </Text>
          <Text className="text-2xl text-gray-500 dark:text-gray-400 mt-1">
            #{String(pokemon.id).padStart(3, '0')}
          </Text>

          <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity
              onPress={handleFavorite}
              className="absolute top-20 right-8 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg"
            >
              <Heart
                size={32}
                color={favorite ? '#ef4444' : '#6b7280'}
                fill={favorite ? '#ef4444' : 'none'}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View className="flex-row justify-center mt-6">
          {pokemon.types.map((t: any) => (
            <Text
              key={t.slot}
              className="mx-2 px-5 py-2 bg-blue-600 text-white rounded-full text-base font-semibold capitalize"
            >
              {t.type.name}
            </Text>
          ))}
        </View>

        <View className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Información
          </Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600 dark:text-gray-300">Altura</Text>
            <Text className="font-bold text-gray-900 dark:text-white">
              {pokemon.height / 10} m
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600 dark:text-gray-300">Peso</Text>
            <Text className="font-bold text-gray-900 dark:text-white">
              {pokemon.weight / 10} kg
            </Text>
          </View>
        </View>

        <View className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Estadísticas
          </Text>
          {pokemon.stats.map((s: any) => (
            <View key={s.stat.name} className="mb-4">
              <View className="flex-row justify-between mb-1">
                <Text className="capitalize text-gray-700 dark:text-gray-300">
                  {s.stat.name.replace('-', ' ')}
                </Text>
                <Text className="font-bold text-gray-900 dark:text-white">
                  {s.base_stat}
                </Text>
              </View>
              <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <View
                  className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  style={{ width: `${(s.base_stat / 255) * 100}%` }}
                />
              </View>
            </View>
          ))}
        </View>

        {evolutionChain.length > 1 && (
          <View className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Evoluciones
            </Text>
            <View className="flex-row justify-center items-center flex-wrap">
              {evolutionChain.map((evo, index) => (
                <View key={evo.id} className="items-center mx-3">
                  <Link href={`/pokemon/${evo.id}`}>
                    <Image
                      source={{
                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`,
                      }}
                      className="w-24 h-24"
                      resizeMode="contain"
                    />
                  </Link>
                  <Text className="text-sm capitalize text-gray-700 dark:text-gray-300 mt-2">
                    {evo.name}
                  </Text>
                  {index < evolutionChain.length - 1 && (
                    <Text className="text-3xl text-gray-400 mx-2">→</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}