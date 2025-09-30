import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f59e42',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 85,
          backgroundColor: 'transparent',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -8 },
          elevation: 12,
          borderTopWidth: 0,
          paddingBottom: 25,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 6,
          fontFamily: 'System',
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          marginHorizontal: 4,
          borderRadius: 16,
          paddingVertical: 4,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#ffffff', '#f8fafc', '#f1f5f9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, borderRadius: 0 }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'home-variant' : 'home-variant-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="produto"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'shopping' : 'shopping-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="carrinho"
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'cart' : 'cart-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="conta"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'account' : 'account-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
