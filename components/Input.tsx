import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Theme';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderWidth: 1,
      borderRadius: BorderRadius.md,
      backgroundColor: disabled ? Colors.background : Colors.surface,
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: multiline ? Spacing.md : Spacing.sm,
      minHeight: multiline ? 80 : 44,
    };

    if (error) {
      return {
        ...baseStyle,
        borderColor: Colors.status.error,
      };
    }

    if (isFocused) {
      return {
        ...baseStyle,
        borderColor: Colors.primary,
      };
    }

    return {
      ...baseStyle,
      borderColor: Colors.border.light,
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontSize: Typography.sizes.md,
      color: disabled ? Colors.text.tertiary : Colors.text.primary,
      fontFamily: Typography.fontFamily,
      textAlignVertical: multiline ? 'top' : 'center',
      ...inputStyle,
    };
  };

  return (
    <View style={style}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <FontAwesome
            name={leftIcon as any}
            size={16}
            color={disabled ? Colors.text.tertiary : Colors.text.secondary}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.tertiary}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          style={getInputStyle()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}
          >
            <FontAwesome
              name={rightIcon as any}
              size={16}
              color={disabled ? Colors.text.tertiary : Colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.xs,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    color: Colors.status.error,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xs,
  },
});
