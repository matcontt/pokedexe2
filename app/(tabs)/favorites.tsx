import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { usePokemon } from '../../lib/hooks/usePokemon';
import { useFavorites } from '../../lib/context/FavoritesContext';
import PokemonCard from '../../components/PokemonCard';
import { useEffect, useState } from 'react';
import pokeApi from '../../lib/pokeApi';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export default function Favorites() {
  const { favorites } = useFavorites();
  const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar los Pokémon favoritos directamente desde la API
  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setFavoritePokemon([]);
        return;
      }

      setLoading(true);
      try {
        const promises = favorites.map(async (id) => {
          try {
            const { data } = await pokeApi.get(`/pokemon/${id}`);
            return {
              id: data.id,
              name: data.name,
              image: data.sprites.other?.['official-artwork']?.front_default || 
                     data.sprites.front_default || 
                     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
              types: data.types.map((t: any) => t.type.name),
            };
          } catch (err) {
            console.error(`Error loading pokemon ${id}:`, err);
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter((p): p is Pokemon => p !== null);
        setFavoritePokemon(validResults);
      } catch (err) {
        console.error('Error loading favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [favorites]);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white p-5 pt-12 border-b border-gray-200">
        <Text className="text-3xl font-extrabold text-gray-800">
          ❤️ Mis Favoritos
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          {favorites.length} Pokémon guardados
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={40} color="#dc2626" />
          <Text className="mt-4 text-gray-600">Cargando favoritos...</Text>
        </View>
      ) : (
        <FlatList
          data={favoritePokemon}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => <PokemonCard pokemon={item} />}
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 20, paddingTop: 8 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20 px-8">
              <Text className="text-8xl mb-5">💔</Text>
              <Text className="text-2xl font-bold text-gray-500 mb-2">
                No tienes favoritos
              </Text>
              <Text className="text-base text-gray-400 text-center leading-6">
                Toca el corazón en cualquier Pokémon para agregarlo a tus favoritos
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}