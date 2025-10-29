import { useState, useEffect, useCallback } from 'react';
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const loadPokemon = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      const { data } = await pokeApi.get(`/pokemon?limit=${limit}&offset=${offset}`);
      const results = await Promise.all(
        data.results.map(async (p: { url: string }) => {
          const res = await pokeApi.get(p.url.replace('https://pokeapi.co/api/v2', ''));
          const pd = res.data;
          return {
            id: pd.id,
            name: pd.name,
            image: pd.sprites.other?.['official-artwork']?.front_default || pd.sprites.front_default || '',
            types: pd.types.map((t: any) => t.type.name),
          };
        })
      );

      setPokemon(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newPokemon = results.filter(p => !existingIds.has(p.id));
        return isLoadMore ? [...prev, ...newPokemon] : newPokemon;
      });

      setOffset(prev => prev + limit);
    } catch (err: any) {
      setError(err.message || 'Error al cargar');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && !loading) loadPokemon(true);
  }, [loadingMore, loading]);

  const reload = useCallback(() => {
    setOffset(0);
    setPokemon([]);
    loadPokemon();
  }, []);

  return { pokemon, loading, loadingMore, error, loadMore, reload };
};