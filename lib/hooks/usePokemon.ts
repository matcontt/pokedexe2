import { useState, useEffect } from 'react';
import pokeApi from '../pokeApi';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export const usePokemon = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPokemon = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await pokeApi.get('/pokemon?limit=20&offset=0');
      const results = await Promise.all(
        data.results.map(async (p: { url: string }) => {
          const res = await pokeApi.get(p.url);
          const pd = res.data;
          return {
            id: pd.id,
            name: pd.name,
            image: pd.sprites.other?.['official-artwork']?.front_default || pd.sprites.front_default,
            types: pd.types.map((t: any) => t.type.name),
          };
        })
      );
      setPokemon(results);
    } catch (err) {
      setError('Error al cargar Pokémon');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  return { pokemon, loading, error, reload: loadPokemon };
};