import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/Theme';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.lg,
      ...Shadows.light,
    };

    // Size styles
    const sizeStyles = {
      small: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? Colors.border.medium : Colors.primary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: disabled ? Colors.border.medium : Colors.secondary,
        borderWidth: 0,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? Colors.border.medium : Colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.6 }),
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: Typography.fontFamily,
      fontWeight: Typography.weights.semibold,
      textAlign: 'center',
    };

    // Size styles
    const sizeStyles = {
      small: {
        fontSize: Typography.sizes.sm,
      },
      medium: {
        fontSize: Typography.sizes.md,
      },
      large: {
        fontSize: Typography.sizes.lg,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        color: Colors.text.inverse,
      },
      secondary: {
        color: Colors.text.inverse,
      },
      outline: {
        color: disabled ? Colors.text.tertiary : Colors.primary,
      },
      ghost: {
        color: disabled ? Colors.text.tertiary : Colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...textStyle,
    };
  };

  const getIconColor = () => {
    if (disabled) return Colors.text.tertiary;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return Colors.text.inverse;
      case 'outline':
      case 'ghost':
        return Colors.primary;
      default:
        return Colors.primary;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <Text style={getTextStyle()}>Carregando...</Text>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <FontAwesome
              name={icon as any}
              size={getIconSize()}
              color={getIconColor()}
              style={{ marginRight: Spacing.sm }}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <FontAwesome
              name={icon as any}
              size={getIconSize()}
              color={getIconColor()}
              style={{ marginLeft: Spacing.sm }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
