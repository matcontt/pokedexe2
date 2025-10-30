import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@pokemon_favorites_v1';

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  addFavorite: (pokemon: any) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar favoritos al iniciar
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log('Favoritos cargados:', parsed);
          setFavorites(parsed);
        }
      } catch (err) {
        console.error('Error cargando favoritos:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  // Guardar favoritos cuando cambien
  useEffect(() => {
    if (!loading) {
      const saveFavorites = async () => {
        try {
          await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
          console.log('Favoritos guardados:', favorites);
        } catch (err) {
          console.error('Error guardando favoritos:', err);
        }
      };
      saveFavorites();
    }
  }, [favorites, loading]);

  const toggleFavorite = (id: number) => {
    console.log('Toggle favorito:', id);
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(f => f !== id) 
        : [...prev, id];
      console.log('Nuevos favoritos:', newFavorites);
      return newFavorites;
    });
  };

  const addFavorite = (pokemon: any) => {
    const id = typeof pokemon === 'number' ? pokemon : pokemon.id;
    console.log('Agregar favorito:', id);
    setFavorites(prev => {
      if (prev.includes(id)) {
        console.log('Ya existe en favoritos');
        return prev;
      }
      const newFavorites = [...prev, id];
      console.log('Favorito agregado:', newFavorites);
      return newFavorites;
    });
  };

  const removeFavorite = (id: number) => {
    console.log('Remover favorito:', id);
    setFavorites(prev => {
      const newFavorites = prev.filter(f => f !== id);
      console.log('Favorito removido:', newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (id: number) => {
    const result = favorites.includes(id);
    return result;
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      toggleFavorite, 
      addFavorite, 
      removeFavorite, 
      isFavorite, 
      loading 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  return context;
};