import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Link } from 'expo-router';
import { Pokemon } from '../lib/hooks/usePokemon';
import { useFavorites } from '../lib/context/FavoritesContext';
import { Heart } from 'lucide-react-native';
import { useRef } from 'react'; // ← AÑADE ESTO

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(pokemon.id);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    toggleFavorite(pokemon.id);
  };

  const bgColor = typeColors[pokemon.types[0]] || typeColors.normal;

  return (
    <View className={`m-2 rounded-2xl overflow-hidden shadow-lg ${bgColor} w-[48%]`}>
      <Link href={`/pokemon/${pokemon.id}`} asChild>
        <View className="p-4 items-center">
          <Image
            source={{ uri: pokemon.image }}
            className="w-24 h-24"
            resizeMode="contain"
          />
          <Text className="text-white font-bold text-base capitalize mt-2">
            {pokemon.name}
          </Text>
          <View className="flex-row mt-1">
            {pokemon.types.map((type) => (
              <Text
                key={type}
                className="text-xs text-white px-3 py-1 bg-black bg-opacity-40 rounded-full mx-0.5"
              >
                {type}
              </Text>
            ))}
          </View>
        </View>
      </Link>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPress={handlePress}
          className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full shadow"
        >
          <Heart
            size={20}
            color={favorite ? '#ef4444' : '#6b7280'}
            fill={favorite ? '#ef4444' : 'none'}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}