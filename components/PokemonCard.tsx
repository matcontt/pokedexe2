import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Link } from 'expo-router';
import { Pokemon } from '../lib/hooks/usePokemon';
import { useFavorites } from '../lib/context/FavoritesContext';
import { Heart } from 'lucide-react-native';
import { useRef } from 'react';

const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(pokemon.id);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    toggleFavorite(pokemon.id);
  };

  const bgColor = typeColors[pokemon.types[0]] || typeColors.normal;

  return (
    <Link href={`/pokemon/${pokemon.id}`} asChild>
      <TouchableOpacity 
        activeOpacity={0.8}
        className="m-1.5 rounded-2xl overflow-hidden shadow-lg w-[46%]"
        style={{ backgroundColor: bgColor }}
      >
        <View className="p-3 items-center relative">
          {/* Número del Pokémon */}
          <Text className="absolute top-2 left-3 text-white/60 text-xs font-bold">
            #{String(pokemon.id).padStart(3, '0')}
          </Text>

          {/* Botón de favorito */}
          <Animated.View 
            className="absolute top-1 right-1 z-10"
            style={{ transform: [{ scale }] }}
          >
            <TouchableOpacity
              onPress={handlePress}
              className="p-2 bg-white/90 rounded-full"
            >
              <Heart
                size={18}
                color={favorite ? '#ef4444' : '#6b7280'}
                fill={favorite ? '#ef4444' : 'none'}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Imagen del Pokémon */}
          <Image
            source={{ uri: pokemon.image }}
            className="w-24 h-24 mt-5"
            resizeMode="contain"
          />

          {/* Nombre del Pokémon */}
          <Text className="text-white font-bold text-base capitalize mt-2">
            {pokemon.name}
          </Text>

          {/* Tipos */}
          <View className="flex-row mt-1.5 flex-wrap justify-center">
            {pokemon.types.map((type) => (
              <Text
                key={type}
                className="text-xs text-white px-2.5 py-1 bg-black/20 rounded-full mx-0.5 font-semibold capitalize"
              >
                {type}
              </Text>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}