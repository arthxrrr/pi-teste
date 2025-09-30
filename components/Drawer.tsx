import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drawerAnim: Animated.Value;
  drawerWidth: number;
}

export function Drawer({ isOpen, onClose, drawerAnim, drawerWidth }: DrawerProps) {
  const router = useRouter();

  const menuItems = [
    { icon: 'home-variant', iconType: 'MaterialCommunityIcons', label: 'Início', route: '/', color: '#f59e42' },
    { icon: 'shopping', iconType: 'MaterialCommunityIcons', label: 'Produtos', route: '/(tabs)/produto', color: '#059669' },
    { icon: 'cart', iconType: 'MaterialCommunityIcons', label: 'Carrinho', route: '/(tabs)/carrinho', color: '#3b82f6' },
    { icon: 'account', iconType: 'MaterialCommunityIcons', label: 'Perfil', route: '/(tabs)/perfil', color: '#8b5cf6' },
    { icon: 'compass', iconType: 'MaterialCommunityIcons', label: 'Explorar', route: '/(tabs)/explore', color: '#f97316' },
  ];

  const categoryItems = [
    { icon: 'cube-outline', iconType: 'MaterialCommunityIcons', label: 'Tijolos Ecológicos', color: '#059669' },
    { icon: 'flower', iconType: 'MaterialCommunityIcons', label: 'Decoração', color: '#ec4899' },
    { icon: 'recycle', iconType: 'MaterialCommunityIcons', label: 'Reciclados', color: '#10b981' },
    { icon: 'leaf', iconType: 'MaterialCommunityIcons', label: 'Sustentáveis', color: '#22c55e' },
  ];

  const supportItems = [
    { icon: 'help-circle-outline', iconType: 'MaterialCommunityIcons', label: 'Central de Ajuda', color: '#6b7280' },
    { icon: 'phone', iconType: 'MaterialCommunityIcons', label: 'Contato', color: '#6b7280' },
    { icon: 'information-outline', iconType: 'MaterialCommunityIcons', label: 'Sobre o App', color: '#6b7280' },
    { icon: 'star-outline', iconType: 'MaterialCommunityIcons', label: 'Avaliar App', color: '#6b7280' },
  ];

  const handleNavigation = (route: string) => {
    onClose();
    if (route === '/') {
      router.replace('/');
    } else {
      router.push(route as any);
    }
  };

  const renderIcon = (item: any) => {
    if (item.iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />;
    }
    return <FontAwesome name={item.icon as any} size={22} color={item.color} />;
  };

  return (
    <>
      {isOpen && (
        <TouchableOpacity style={styles.drawerOverlay} activeOpacity={1} onPress={onClose} />
      )}
      <Animated.View style={[styles.drawer, { left: drawerAnim, width: drawerWidth }]}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc', '#f1f5f9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.drawerGradient}
        >
          <ScrollView 
            style={styles.drawerContent} 
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header com perfil do usuário */}
            <View style={styles.drawerHeader}>
              <View style={styles.avatarContainer}>
                <Image source={require('@/assets/images/luiz.png')} style={styles.drawerAvatar} />
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.drawerUserInfo}>
                <Text style={styles.drawerUserName}>Luiz Eduardo</Text>
                <Text style={styles.drawerUserEmail}>luiz.eduardo@email.com</Text>
                <View style={styles.userStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Online</Text>
                </View>
              </View>
            </View>
            
            {/* Menu Principal */}
            <View style={styles.sectionContainer}>
              <Text style={styles.drawerSectionTitle}>Menu Principal</Text>
              {menuItems.map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.drawerItem} 
                  onPress={() => handleNavigation(item.route)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                    {renderIcon(item)}
                  </View>
                  <Text style={styles.drawerItemText}>{item.label}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Categorias */}
            <View style={styles.sectionContainer}>
              <Text style={styles.drawerSectionTitle}>Categorias</Text>
              {categoryItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.drawerItem} activeOpacity={0.7}>
                  <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                    {renderIcon(item)}
                  </View>
                  <Text style={styles.drawerItemText}>{item.label}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Suporte */}
            <View style={styles.sectionContainer}>
              <Text style={styles.drawerSectionTitle}>Suporte</Text>
              {supportItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.drawerItem} activeOpacity={0.7}>
                  <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                    {renderIcon(item)}
                  </View>
                  <Text style={styles.drawerItemText}>{item.label}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Logout */}
            <View style={styles.sectionContainer}>
              <TouchableOpacity style={[styles.drawerItem, styles.logoutItem]} activeOpacity={0.7}>
                <View style={[styles.iconContainer, { backgroundColor: '#ef444415' }]}>
                  <MaterialCommunityIcons name="logout" size={24} color="#ef4444" />
                </View>
                <Text style={[styles.drawerItemText, styles.logoutText]}>Sair da Conta</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 15,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 4, height: 0 },
    elevation: 12,
  },
  drawerGradient: {
    flex: 1,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 9,
  },
  drawerContent: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  drawerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#f59e42',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22c55e',
    borderWidth: 3,
    borderColor: '#fff',
  },
  drawerUserInfo: {
    flex: 1,
  },
  drawerUserName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'System',
    marginBottom: 4,
  },
  drawerUserEmail: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'System',
    marginBottom: 8,
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#22c55e',
    fontFamily: 'System',
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  drawerSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 16,
    fontFamily: 'System',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  drawerItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontFamily: 'System',
    fontWeight: '400',
  },
  logoutItem: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
