import { View, Text, Image } from 'react-native';
import { Link } from 'expo-router';
import { Pokemon } from '../lib/hooks/usePokemon';

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
  const bgColor = typeColors[pokemon.types[0]] || typeColors.normal;

  return (
    <Link href={`/pokemon/${pokemon.id}`} asChild>
      <View className={`m-2 rounded-xl overflow-hidden shadow-md ${bgColor} w-[48%]`}>
        <View className="p-3 items-center">
          <Image
            source={{ uri: pokemon.image }}
            className="w-20 h-20"
            resizeMode="contain"
          />
          <Text className="text-white font-bold text-sm capitalize mt-1">
            {pokemon.name}
          </Text>
          <View className="flex-row mt-1 flex-wrap justify-center">
            {pokemon.types.map((type) => (
              <Text
                key={type}
                className="text-xs text-white px-2 py-0.5 bg-black bg-opacity-30 rounded-full mx-0.5"
              >
                {type}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Link>
  );
}