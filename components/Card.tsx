import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/Theme';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  style,
}: CardProps) {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.lg,
    };

    // Variant styles
    const variantStyles = {
      default: {
        ...Shadows.light,
      },
      elevated: {
        ...Shadows.medium,
      },
      outlined: {
        borderWidth: 1,
        borderColor: Colors.border.light,
        shadowOpacity: 0,
        elevation: 0,
      },
      filled: {
        backgroundColor: Colors.background,
        shadowOpacity: 0,
        elevation: 0,
      },
    };

    // Padding styles
    const paddingStyles = {
      none: {},
      small: {
        padding: Spacing.sm,
      },
      medium: {
        padding: Spacing.lg,
      },
      large: {
        padding: Spacing.xl,
      },
    };

    // Margin styles
    const marginStyles = {
      none: {},
      small: {
        margin: Spacing.sm,
      },
      medium: {
        margin: Spacing.md,
      },
      large: {
        margin: Spacing.lg,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...marginStyles[margin],
      ...style,
    };
  };

  return <View style={getCardStyle()}>{children}</View>;
}
