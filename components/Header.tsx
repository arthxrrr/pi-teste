import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  onMenuPress: () => void;
  isMenuOpen?: boolean;
  rightButton?: {
    icon: string;
    onPress: () => void;
    badge?: number;
  };
}

export function Header({ title, onMenuPress, isMenuOpen = false, rightButton }: HeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 8, zIndex: isMenuOpen ? 5 : 20 }]}>
      <View style={styles.headerModern}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <FontAwesome name="bars" size={28} color="#f59e42" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{title}</Text>
        
        {rightButton ? (
          <TouchableOpacity style={styles.cartButton} onPress={rightButton.onPress}>
            <FontAwesome name={rightButton.icon as any} size={24} color="#f59e42" />
            {rightButton.badge && rightButton.badge > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{rightButton.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    zIndex: 20,
  },
  headerModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'SpaceMono',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 44,
  },
});
