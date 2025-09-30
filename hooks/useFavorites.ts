import { DbApi } from '@/projetointegrador/DB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export interface FavoriteProduct {
  id: string;
  nome: string;
  preco: string;
  precoOriginal?: string;
  imagem: any;
  categoria: string;
  emPromocao?: boolean;
  estoque: number;
  favorito: boolean;
  avaliacao?: number;
  numAvaliacoes?: number;
}

const FAVORITES_STORAGE_KEY = '@ecobrick_favorites';

export function useFavorites(options?: { userId?: string }) {
  const userId = options?.userId ?? 'user-1';
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar favoritos do AsyncStorage e conciliar com Supabase (pull)
  useEffect(() => {
    loadFavorites();
  }, []);

  // Salvar favoritos no AsyncStorage sempre que mudar
  useEffect(() => {
    if (!loading) {
      saveFavorites();
    }
  }, [favorites, loading]);

  const loadFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData));
      }

      // Conciliar com Supabase: aqui supomos que os produtos localmente carregados
      // serão marcados como favorito se existir o par em favorites do servidor
      try {
        // Poderíamos buscar todos os favorites e marcar nos itens locais
        // Como não temos a lista de produtos global aqui, manteremos o cache atual
        // e confiaremos no write-through abaixo para manter consistência.
      } catch (e) {
        console.warn('Falha ao sincronizar favoritos do Supabase (pull):', e);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async () => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const addToFavorites = (product: FavoriteProduct) => {
    setFavorites(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) return prev;

      const next = [...prev, { ...product, favorito: true }];
      DbApi.toggleFavorite(userId, product.id).catch(() => {});
      return next;
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
    DbApi.toggleFavorite(userId, productId).catch(() => {});
  };

  const toggleFavorite = (product: FavoriteProduct) => {
    const isFavorite = isInFavorites(product.id);

    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isInFavorites = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
    // Não fazemos flush de todos no servidor aqui para evitar muitas requisições
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isInFavorites,
    clearFavorites,
    getFavoritesCount,
  };
}
