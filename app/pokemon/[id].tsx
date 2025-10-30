import { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, ChevronDown, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFavorites } from '../../lib/context/FavoritesContext';
import { getTypeColors, PokemonType } from '../../lib/utils';
import pokeApi from '../../lib/pokeApi';

interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  species: {
    url: string;
  };
}

interface EvolutionChainItem {
  id: string;
  species_name: string;
  min_level: number | null;
  trigger_name: string | null;
  item: string | null;
  image: string;
}

export default function PokemonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [species, setSpecies] = useState<any | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChainItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const typeColors = getTypeColors();

  const handleFavorite = () => {
    if (!pokemon) return;
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
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
        setLoading(true);
        
        const pokemonResponse = await pokeApi.get(`/pokemon/${id}`);
        const pokeData: PokemonData = pokemonResponse.data;

        const speciesResponse = await pokeApi.get(
          pokeData.species.url.replace('https://pokeapi.co/api/v2', '')
        );
        const speciesData = speciesResponse.data;

        let chain: EvolutionChainItem[] = [];
        if (speciesData.evolution_chain?.url) {
          const evolutionResponse = await pokeApi.get(
            speciesData.evolution_chain.url.replace('https://pokeapi.co/api/v2', '')
          );
          
          let evoData = evolutionResponse.data.chain;
          
          while (evoData) {
            const evoDetails = evoData.evolution_details[0];
            const speciesName = evoData.species.name;
            const speciesId = evoData.species.url.split('/').slice(-2, -1)[0];
            const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`;
            
            chain.push({
              id: speciesId,
              species_name: speciesName,
              min_level: evoDetails?.min_level || null,
              trigger_name: evoDetails?.trigger?.name || null,
              item: evoDetails?.item?.name || null,
              image
            });
            
            evoData = evoData.evolves_to[0];
          }
        }

        setPokemon(pokeData);
        setSpecies(speciesData);
        setEvolutionChain(chain);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        console.error('Error fetching pokemon:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size={60} color="#dc2626" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-xl">Pokémon no encontrado</Text>
      </View>
    );
  }

  const favorite = isFavorite(pokemon.id);
  const primaryType = (pokemon.types && pokemon.types.length > 0 
    ? pokemon.types[0].type.name 
    : 'normal') as PokemonType;
  const gradientColors = typeColors[primaryType] as [string, string];

  const description = species?.flavor_text_entries
    ?.find((entry: any) => entry.language.name === 'es')
    ?.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ') 
    || 'No hay descripción disponible en español.';

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <LinearGradient
        colors={gradientColors}
        className="pt-12 pb-10 items-center relative"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-4 p-2 bg-black/20 rounded-full z-10"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>

        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="absolute top-12 right-4 z-10"
        >
          <TouchableOpacity
            onPress={handleFavorite}
            className="p-2 bg-black/20 rounded-full"
          >
            <Heart
              size={28}
              color={favorite ? '#ef4444' : 'white'}
              fill={favorite ? '#ef4444' : 'none'}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="items-center"
        >
          <Image
            source={{ 
              uri: pokemon.sprites.other?.['official-artwork']?.front_default 
                || pokemon.sprites.front_default 
            }}
            className="w-64 h-64"
            resizeMode="contain"
          />
          <Text className="text-white text-4xl font-extrabold capitalize mt-4">
            {pokemon.name}
          </Text>
          <Text className="text-white/90 text-xl font-semibold mt-1">
            #{String(pokemon.id).padStart(3, '0')}
          </Text>
        </Animated.View>
      </LinearGradient>

      <View className="p-4 -mt-5 bg-gray-100 rounded-t-3xl">
        <View className="flex-row justify-center mb-5">
          {pokemon.types.map((typeInfo) => {
            const typeName = typeInfo.type.name as PokemonType;
            const typeColor = typeColors[typeName]?.[0] || '#A8A878';
            
            return (
              <View
                key={typeInfo.type.name}
                className="mx-1.5 px-5 py-2 rounded-full"
                style={{ backgroundColor: typeColor }}
              >
                <Text className="text-white font-bold capitalize text-base">
                  {typeInfo.type.name}
                </Text>
              </View>
            );
          })}
        </View>

        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-xl font-extrabold text-gray-800 mb-3">
            Descripción
          </Text>
          <Text className="text-base text-gray-600 leading-6 text-justify">
            {description}
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-xl font-extrabold text-gray-800 mb-4">
            Información
          </Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-sm text-gray-600 mb-1">Altura</Text>
              <Text className="text-xl font-bold text-gray-900">
                {pokemon.height / 10} m
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-gray-600 mb-1">Peso</Text>
              <Text className="text-xl font-bold text-gray-900">
                {pokemon.weight / 10} kg
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-xl font-extrabold text-gray-800 mb-3">
            Habilidades
          </Text>
          <View className="flex-row flex-wrap">
            {pokemon.abilities.map((a) => (
              <View
                key={a.ability.name}
                className="bg-gray-100 px-4 py-2 rounded-full mr-2 mb-2"
              >
                <Text className="text-gray-800 capitalize font-semibold">
                  {a.ability.name.replace('-', ' ')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-xl font-extrabold text-gray-800 mb-4">
            Estadísticas
          </Text>
          {pokemon.stats.map((s) => {
            const percentage = (s.base_stat / 255) * 100;
            const barColor = percentage > 80 ? '#10b981' : percentage > 50 ? '#f59e0b' : '#ef4444';
            return (
              <View key={s.stat.name} className="mb-4">
                <View className="flex-row justify-between mb-1.5">
                  <Text className="text-sm text-gray-700 capitalize font-semibold">
                    {s.stat.name.replace('-', ' ')}
                  </Text>
                  <Text className="text-base font-bold text-gray-900">
                    {s.base_stat}
                  </Text>
                </View>
                <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-2 rounded-full"
                    style={{ width: `${percentage}%`, backgroundColor: barColor }}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {evolutionChain.length > 1 && (
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text className="text-xl font-extrabold text-gray-800 mb-4">
              Cadena de Evolución
            </Text>
            <View className="items-center">
              {evolutionChain.map((evo, index) => (
                <View key={evo.id} className="items-center w-full">
                  <TouchableOpacity 
                    onPress={() => router.push(`/pokemon/${evo.id}`)}
                    className="items-center"
                  >
                    <View className="bg-gray-100 rounded-2xl p-3 mb-2">
                      <Image 
                        source={{ uri: evo.image }} 
                        className="w-24 h-24"
                        resizeMode="contain"
                      />
                    </View>
                    <Text className="font-bold capitalize text-center text-gray-800">
                      {evo.species_name}
                    </Text>
                  </TouchableOpacity>
                  
                  {index < evolutionChain.length - 1 && (
                    <View className="items-center my-3">
                      <ChevronDown size={24} color="#9ca3af" />
                      {evolutionChain[index + 1].min_level ? (
                        <Text className="text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-full font-semibold mt-1">
                          Nivel {evolutionChain[index + 1].min_level}
                        </Text>
                      ) : evolutionChain[index + 1].item ? (
                        <Text className="text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-full font-semibold mt-1 capitalize">
                          {evolutionChain[index + 1].item?.replace('-', ' ') || 'Item'}
                        </Text>
                      ) : (
                        <Text className="text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-full font-semibold mt-1 capitalize">
                          {evolutionChain[index + 1].trigger_name || 'Evoluciona'}
                        </Text>
                      )}
                    </View>
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