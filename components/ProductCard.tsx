import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
  product: {
    id: string;
    nome: string;
    preco: string;
    precoOriginal?: string;
    imagem: any;
    categoria: string;
    emPromocao?: boolean;
    estoque: number;
    favorito?: boolean;
    avaliacao?: number;
    numAvaliacoes?: number;
  };
  onToggleFavorite?: (id: string) => void;
  onAddToCart?: (product: any) => void;
  onShare?: (product: any) => void;
  variant?: 'horizontal' | 'vertical';
}

export function ProductCard({ 
  product, 
  onToggleFavorite, 
  onAddToCart, 
  onShare,
  variant = 'vertical' 
}: ProductCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={12}
          color={i <= rating ? '#FFD700' : '#DDD'}
        />
      );
    }
    return stars;
  };

  if (variant === 'horizontal') {
    return (
      <View style={styles.horizontalCard}>
        <Image source={product.imagem} style={styles.horizontalImage} />
        <View style={styles.horizontalContent}>
          <Text style={styles.horizontalCategoria}>{product.categoria}</Text>
          <Text style={styles.horizontalNome}>{product.nome}</Text>
          <View style={styles.horizontalPriceContainer}>
            <Text style={styles.horizontalPreco}>{product.preco}</Text>
            {product.precoOriginal && (
              <Text style={styles.horizontalPrecoOriginal}>{product.precoOriginal}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite?.(product.id)}
        >
          <FontAwesome
            name={product.favorito ? 'heart' : 'heart-o'}
            size={16}
            color={product.favorito ? '#E91E63' : '#666'}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Header simples com favorito */}
      <View style={styles.cardHeader}>
        <View style={styles.simpleBadge}>
          {product.emPromocao && (
            <Text style={styles.simplePromoText}>PROMOÇÃO</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.favoritoButton}
          onPress={() => onToggleFavorite?.(product.id)}
        >
          <FontAwesome
            name={product.favorito ? 'heart' : 'heart-o'}
            size={18}
            color={product.favorito ? '#E91E63' : '#666'}
          />
        </TouchableOpacity>
      </View>

      {/* Container da imagem */}
      <View style={styles.imageContainer}>
        <Image source={product.imagem} style={styles.imagem} />
      </View>

      {/* Informações do produto simplificadas */}
      <View style={styles.productInfo}>
        <Text style={styles.nomeProduto} numberOfLines={2}>{product.nome}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.precoProduto}>{product.preco}</Text>
          {product.precoOriginal && (
            <Text style={styles.precoOriginal}>{product.precoOriginal}</Text>
          )}
        </View>
      </View>

      {/* Botões de ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.botaoComprar, product.estoque === 0 && styles.botaoDisabled]}
          onPress={() => onAddToCart?.(product)}
          disabled={product.estoque === 0}
        >
          <FontAwesome name="shopping-cart" size={12} color="#fff" />
          <Text style={styles.textoBotaoComprar}>
            {product.estoque === 0 ? 'Esgotado' : 'Comprar'}
          </Text>
        </TouchableOpacity>
        
        {onShare && (
          <TouchableOpacity style={styles.botaoCompartilhar} onPress={() => onShare(product)}>
            <FontAwesome name="share" size={12} color="#f59e42" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
    height: 300,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    height: 48,
  },
  simpleBadge: {
    flex: 1,
  },
  simplePromoText: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '700',
    fontFamily: 'SpaceMono',
    letterSpacing: 0.5,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'flex-start',
  },
  promocaoBadge: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promocaoText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  descontoBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descontoText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  favoritoButton: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    marginBottom: 8,
    height: 120,
    justifyContent: 'center',
  },
  imagem: { 
    width: '100%', 
    height: 120, 
    resizeMode: 'cover', 
    borderRadius: 8 
  },
  productInfo: {
    padding: 12,
    paddingTop: 4,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 80,
  },
  nomeProduto: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'System',
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  ratingSection: {
    height: 20,
    justifyContent: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'SpaceMono',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    justifyContent: 'flex-start',
  },
  precoProduto: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '700',
    fontFamily: 'System',
    marginRight: 8,
    letterSpacing: 0.1,
  },
  precoOriginal: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    fontFamily: 'System',
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 6,
    height: 48,
    alignItems: 'center',
  },
  botaoComprar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f59e42',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 36,
  },
  botaoDisabled: {
    backgroundColor: '#d1d5db',
  },
  textoBotaoComprar: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'SpaceMono',
    letterSpacing: 0.3,
  },
  botaoCompartilhar: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    minHeight: 36,
  },
  // Horizontal variant styles
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  horizontalImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  horizontalContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  horizontalCategoria: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'SpaceMono',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  horizontalNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'System',
    marginTop: 4,
    marginBottom: 6,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  horizontalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalPreco: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '700',
    fontFamily: 'System',
    marginRight: 8,
    letterSpacing: 0.1,
  },
  horizontalPrecoOriginal: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    fontFamily: 'System',
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
});
