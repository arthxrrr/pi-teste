import { DbApi } from '@/projetointegrador/DB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  precoOriginal?: number;
  quantidade: number;
  imagem: any;
  categoria: string;
  peso?: string;
  dimensoes?: string;
  emPromocao?: boolean;
  desconto?: number;
}

export interface Coupon {
  codigo: string;
  desconto: number;
  descricao: string;
  tipo: 'percentage' | 'fixed' | 'shipping';
}

const CART_STORAGE_KEY = '@ecobrick_cart';
const COUPON_STORAGE_KEY = '@ecobrick_coupon';

export function useCart(options?: { userId?: string }) {
  const userId = options?.userId ?? 'user-1';
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar carrinho (AsyncStorage) e conciliar com Supabase (se userId disponível)
  useEffect(() => {
    loadCart();
  }, []);

  // Salvar carrinho no AsyncStorage sempre que mudar
  useEffect(() => {
    if (!loading) {
      saveCart();
    }
  }, [cartItems, loading]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      const couponData = await AsyncStorage.getItem(COUPON_STORAGE_KEY);
      
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
      
      if (couponData) {
        setAppliedCoupon(JSON.parse(couponData));
      }

      // Tenta conciliar com Supabase (pull) – mantém itens locais com detalhes e aplica quantidades do servidor
      try {
        if (userId) {
          const rows = await DbApi.listCart(userId);
          if (rows && rows.length > 0) {
            setCartItems(prev => {
              const idToQty = new Map(rows.map(r => [r.productId, r.quantidade] as const));
              return prev.map(item =>
                idToQty.has(item.id)
                  ? { ...item, quantidade: idToQty.get(item.id)! }
                  : item
              );
            });
          }
        }
      } catch (e) {
        console.warn('Falha ao sincronizar carrinho do Supabase (pull):', e);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      if (appliedCoupon) {
        await AsyncStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      }
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  };

  const addToCart = (product: Omit<CartItem, 'quantidade'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        const next = prev.map(item =>
          item.id === product.id
            ? { ...item, quantidade: Math.min(item.quantidade + 1, 99) }
            : item
        );
        // write-through Supabase
        DbApi.setCartItem(userId, product.id, Math.min((existingItem.quantidade + 1), 99)).catch(() => {});
        return next;
      }
      
      const next = [...prev, { ...product, quantidade: 1 }];
      DbApi.setCartItem(userId, product.id, 1).catch(() => {});
      return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    DbApi.setCartItem(userId, productId, 0).catch(() => {});
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const clamped = Math.min(quantity, 99);
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantidade: clamped }
          : item
      )
    );
    DbApi.setCartItem(userId, productId, clamped).catch(() => {});
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    // best-effort: zera itens atuais no Supabase
    try {
      cartItems.forEach(item => {
        DbApi.setCartItem(userId, item.id, 0).catch(() => {});
      });
    } catch {}
  };

  const applyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantidade, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = getSubtotal();
    
    switch (appliedCoupon.tipo) {
      case 'percentage':
        return (subtotal * appliedCoupon.desconto) / 100;
      case 'fixed':
        return appliedCoupon.desconto;
      case 'shipping':
        return 0; // Frete grátis
      default:
        return 0;
    }
  };

  const getShippingCost = () => {
    if (appliedCoupon?.tipo === 'shipping') return 0;
    
    const subtotal = getSubtotal();
    return subtotal >= 50 ? 0 : 15;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount() + getShippingCost();
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantidade : 0;
  };

  return {
    cartItems,
    appliedCoupon,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getTotalItems,
    getSubtotal,
    getDiscount,
    getShippingCost,
    getTotal,
    isInCart,
    getItemQuantity,
  };
}
