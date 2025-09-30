import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardGridProps {
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
  size?: 'small' | 'medium' | 'large';
  showRating?: boolean;
}

export function ProductCardGrid({ 
  product, 
  onToggleFavorite, 
  onAddToCart, 
  onShare,
  size = 'medium',
  showRating = false
}: ProductCardGridProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialCommunityIcons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={12}
          color={i <= rating ? '#FFD700' : '#DDD'}
        />
      );
    }
    return stars;
  };

  const getCardStyle = () => {
    switch (size) {
      case 'small':
        return styles.cardSmall;
      case 'large':
        return styles.cardLarge;
      default:
        return styles.cardMedium;
    }
  };

  const getImageStyle = () => {
    switch (size) {
      case 'small':
        return styles.imageSmall;
      case 'large':
        return styles.imageLarge;
      default:
        return styles.imageMedium;
    }
  };

  return (
    <View style={[styles.card, getCardStyle()]}>
      {/* Header com badge e favorito */}
      <View style={styles.cardHeader}>
        <View style={styles.badgeContainer}>
          {product.emPromocao && (
            <View style={styles.promoBadge}>
              <MaterialCommunityIcons name="tag" size={10} color="#fff" />
              <Text style={styles.promoText}>PROMO</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite?.(product.id)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={product.favorito ? 'heart' : 'heart-outline'}
            size={18}
            color={product.favorito ? '#E91E63' : Colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Container da imagem */}
      <View style={styles.imageContainer}>
        <Image source={product.imagem} style={[styles.image, getImageStyle()]} />
      </View>

      {/* Informações do produto */}
      <View style={styles.productInfo}>
        <Text style={styles.categoryText}>{product.categoria}</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.nome}</Text>
        
        {showRating && product.avaliacao && (
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(product.avaliacao)}
            </View>
            <Text style={styles.ratingText}>
              {product.avaliacao.toFixed(1)} ({product.numAvaliacoes || 0})
            </Text>
          </View>
        )}

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{product.preco}</Text>
          {product.precoOriginal && (
            <Text style={styles.originalPrice}>{product.precoOriginal}</Text>
          )}
        </View>
      </View>

      {/* Botões de ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[
            styles.buyButton, 
            product.estoque === 0 && styles.buyButtonDisabled
          ]}
          onPress={() => onAddToCart?.(product)}
          disabled={product.estoque === 0}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="shopping-cart" 
            size={14} 
            color={product.estoque === 0 ? Colors.text.tertiary : "#fff"} 
          />
          <Text style={[
            styles.buyButtonText,
            product.estoque === 0 && styles.buyButtonTextDisabled
          ]}>
            {product.estoque === 0 ? 'Esgotado' : 'Comprar'}
          </Text>
        </TouchableOpacity>
        
        {onShare && (
          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={() => onShare(product)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="share" size={14} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.medium,
    overflow: 'hidden',
    flex: 1,
  },
  cardSmall: {
    height: 280,
    marginHorizontal: Spacing.xs,
  },
  cardMedium: {
    height: 320,
    marginHorizontal: Spacing.sm,
  },
  cardLarge: {
    height: 360,
    marginHorizontal: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    height: 44,
  },
  badgeContainer: {
    flex: 1,
  },
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    gap: 4,
  },
  promoText: {
    color: Colors.text.onError,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.fontFamily,
    letterSpacing: 0.5,
  },
  favoriteButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    marginBottom: Spacing.sm,
    height: 120,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
    borderRadius: BorderRadius.md,
  },
  imageSmall: {
    height: 100,
  },
  imageMedium: {
    height: 120,
  },
  imageLarge: {
    height: 140,
  },
  productInfo: {
    padding: Spacing.md,
    paddingTop: Spacing.xs,
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  productName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    fontFamily: Typography.fontFamily,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeights.tight * Typography.sizes.md,
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: Spacing.xs,
  },
  ratingText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  currentPrice: {
    fontSize: Typography.sizes.lg,
    color: Colors.success,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.fontFamily,
    marginRight: Spacing.sm,
  },
  originalPrice: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
    textDecorationLine: 'line-through',
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
    height: 48,
    alignItems: 'center',
  },
  buyButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    minHeight: 36,
    ...Shadows.light,
  },
  buyButtonDisabled: {
    backgroundColor: Colors.border.light,
  },
  buyButtonText: {
    color: Colors.text.onPrimary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.fontFamily,
    letterSpacing: 0.3,
  },
  buyButtonTextDisabled: {
    color: Colors.text.tertiary,
  },
  shareButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    minHeight: 36,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
});
