import { useState, useEffect, useCallback } from 'react';
import pokeApi from '../../lib/pokeApi';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export const usePokemon = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const loadPokemon = async (isLoadMore = false, currentOffset = offset) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const { data } = await pokeApi.get(`/pokemon?limit=${limit}&offset=${currentOffset}`);
      
      const results = await Promise.all(
        data.results.map(async (p: { url: string }) => {
          try {
            const res = await pokeApi.get(p.url.replace('https://pokeapi.co/api/v2', ''));
            const pd = res.data;
            return {
              id: pd.id,
              name: pd.name,
              image: pd.sprites.other?.['official-artwork']?.front_default || 
                     pd.sprites.front_default || 
                     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
              types: pd.types.map((t: any) => t.type.name),
            };
          } catch (err) {
            console.error('Error loading pokemon:', err);
            return null;
          }
        })
      );

      const validResults = results.filter((p): p is Pokemon => p !== null);

      setPokemon(prev => {
        if (isLoadMore) {
          const existingIds = new Set(prev.map(p => p.id));
          const newPokemon = validResults.filter(p => !existingIds.has(p.id));
          return [...prev, ...newPokemon];
        }
        return validResults;
      });

    } catch (err: any) {
      setError(err.message || 'Error al cargar los Pokémon');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPokemon(false, 0);
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && !loading) {
      const newOffset = offset + limit;
      setOffset(newOffset);
      loadPokemon(true, newOffset);
    }
  }, [loadingMore, loading, offset]);

  const reload = useCallback(() => {
    setOffset(0);
    setPokemon([]);
    loadPokemon(false, 0);
  }, []);

  return { pokemon, loading, loadingMore, error, loadMore, reload };
};