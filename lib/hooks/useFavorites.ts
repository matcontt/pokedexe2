import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'pokemon_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // CARGAR AL INICIAR
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) setFavorites(JSON.parse(stored));
      } catch (err) {
        console.error('Error loading favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  // GUARDAR AL CAMBIAR
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)).catch(console.error);
    }
  }, [favorites, loading]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return { favorites, isFavorite, toggleFavorite, loading };
};