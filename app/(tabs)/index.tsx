import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Drawer } from '@/components/Drawer';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { Colors, Typography } from '@/constants/Theme';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/projetointegrador/AuthProvider';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const drawerWidth = SCREEN_WIDTH * 0.7;

// Dados dos produtos com mais informações
const produtos = [
  {
    id: '1',
    nome: 'Tijolo Ecológico Premium',
    preco: 'R$ 2,50',
    precoOriginal: 'R$ 3,00',
    imagem: require('@/assets/images/tijolo.png'),
    categoria: 'Tijolos',
    emPromocao: true,
    estoque: 150,
    favorito: false,
    avaliacao: 4.8,
    numAvaliacoes: 234,
    peso: '2.5kg',
    dimensoes: '20x10x5cm'
  },
  {
    id: '2',
    nome: 'Tijolo Quadrado Artesanal',
    preco: 'R$ 3,00',
    imagem: require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
    categoria: 'Tijolos',
    emPromocao: false,
    estoque: 89,
    favorito: false,
    avaliacao: 4.6,
    numAvaliacoes: 156,
    peso: '2.8kg',
    dimensoes: '15x15x5cm'
  },
  {
    id: '3',
    nome: 'Tijolo Retangular Moderno',
    preco: 'R$ 3,20',
    imagem: require('@/assets/images/tijolo-ilus-retangulo.jpg'),
    categoria: 'Tijolos',
    emPromocao: false,
    estoque: 67,
    favorito: false,
    avaliacao: 4.7,
    numAvaliacoes: 189,
    peso: '3.0kg',
    dimensoes: '25x12x6cm'
  },
  {
    id: '4',
    nome: 'Tijolo Quadrado Premium',
    preco: 'R$ 4,00',
    imagem: require('@/assets/images/tijolo-ilus-quadrado.webp'),
    categoria: 'Tijolos',
    emPromocao: false,
    estoque: 45,
    favorito: false,
    avaliacao: 4.9,
    numAvaliacoes: 98,
    peso: '3.2kg',
    dimensoes: '18x18x6cm'
  },
  {
    id: '5',
    nome: 'Vaso Quadrado Decorativo',
    preco: 'R$ 12,00',
    precoOriginal: 'R$ 15,00',
    imagem: require('@/assets/images/vaso-quadrado.jpg'),
    categoria: 'Vasos',
    emPromocao: true,
    estoque: 23,
    favorito: false,
    avaliacao: 4.5,
    numAvaliacoes: 67,
    peso: '1.8kg',
    dimensoes: '20x20x15cm'
  },
  {
    id: '6',
    nome: 'Vaso Quadrado Artístico',
    preco: 'R$ 15,00',
    imagem: require('@/assets/images/vaso-quadrado2.jpg'),
    categoria: 'Vasos',
    emPromocao: false,
    estoque: 34,
    favorito: false,
    avaliacao: 4.8,
    numAvaliacoes: 89,
    peso: '2.1kg',
    dimensoes: '22x22x18cm'
  },
  {
    id: '7',
    nome: 'Vaso Retangular Elegante',
    preco: 'R$ 18,00',
    imagem: require('@/assets/images/vaso-retangular.jpg'),
    categoria: 'Vasos',
    emPromocao: false,
    estoque: 19,
    favorito: false,
    avaliacao: 4.6,
    numAvaliacoes: 45,
    peso: '2.5kg',
    dimensoes: '30x15x20cm'
  },
  {
    id: '8',
    nome: 'Kit Sustentabilidade',
    preco: 'R$ 45,00',
    precoOriginal: 'R$ 60,00',
    imagem: require('@/assets/images/tijolo-ilus-quadrado.webp'),
    categoria: 'Kits',
    emPromocao: true,
    estoque: 12,
    favorito: false,
    avaliacao: 4.9,
    numAvaliacoes: 23,
    peso: '8.5kg',
    dimensoes: 'Kit completo'
  }
];

// Categorias com mais informações
const categorias = [
  { 
    id: 'tijolos', 
    nome: 'Tijolos', 
    icon: 'cube-outline', 
    cor: '#f59e42',
    descricao: 'Ecológicos e resistentes',
    produtos: 45
  },
  { 
    id: 'vasos', 
    nome: 'Vasos', 
    icon: 'flower-outline', 
    cor: '#43a047',
    descricao: 'Decorativos e funcionais',
    produtos: 23
  },
  { 
    id: 'ofertas', 
    nome: 'Ofertas', 
    icon: 'star-outline', 
    cor: '#ef4444',
    descricao: 'Promoções especiais',
    produtos: 12
  },
  { 
    id: 'eco', 
    nome: 'Eco', 
    icon: 'leaf', 
    cor: '#10b981',
    descricao: '100% sustentáveis',
    produtos: 18
  },
  { 
    id: 'kits', 
    nome: 'Kits', 
    icon: 'package-variant', 
    cor: '#8b5cf6',
    descricao: 'Combos especiais',
    produtos: 8
  },
  { 
    id: 'personalizados', 
    nome: 'Personalizados', 
    icon: 'palette', 
    cor: '#f59e0b',
    descricao: 'Sob medida',
    produtos: 6
  }
];

// Estatísticas da empresa
const estatisticas = [
  { numero: '500+', label: 'Clientes Satisfeitos', icon: 'account-group' },
  { numero: '2.5k+', label: 'Produtos Vendidos', icon: 'package-variant' },
  { numero: '98%', label: 'Avaliação Positiva', icon: 'star' },
  { numero: '24h', label: 'Suporte Disponível', icon: 'headset' }
];

// Benefícios da empresa
const beneficios = [
  { 
    icon: 'leaf', 
    label: '100% Sustentável', 
    descricao: 'Materiais ecológicos',
    cor: '#10b981'
  },
  { 
    icon: 'shield-check', 
    label: 'Garantia Total', 
    descricao: '12 meses de garantia',
    cor: '#3b82f6'
  },
  { 
    icon: 'truck-fast', 
    label: 'Entrega Rápida', 
    descricao: 'Até 48h em todo Brasil',
    cor: '#f59e42'
  },
  { 
    icon: 'recycle', 
    label: 'Reciclado', 
    descricao: 'Materiais reutilizados',
    cor: '#8b5cf6'
  }
];

// Banners promocionais
const banners = [
  {
    id: 1,
    imagem: require('@/assets/images/vaso-retangular.jpg'),
    titulo: 'Nova Coleção 2024',
    subtitulo: 'Vasos Artísticos',
    cor: '#8b5cf6',
    desconto: '20% OFF'
  },
  {
    id: 2,
    imagem: require('@/assets/images/tijolo-ilus-retangulo.jpg'),
    titulo: 'Tijolos Ecológicos',
    subtitulo: 'Sustentabilidade em cada peça',
    cor: '#10b981',
    desconto: 'Frete Grátis'
  },
  {
    id: 3,
    imagem: require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
    titulo: 'Kit Completo',
    subtitulo: 'Tudo que você precisa',
    cor: '#f59e42',
    desconto: 'R$ 50 OFF'
  }
];

export default function HomeScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnim] = useState(new Animated.Value(-drawerWidth));
  const [bannerIndex, setBannerIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const bannerScrollRef = useRef<ScrollView>(null);
  const mainScrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const stickyOpacity = useRef(new Animated.Value(0)).current;
  const stickyTranslateY = useRef(new Animated.Value(-50)).current;
  const router = useRouter();

  // Hooks personalizados
  const { user } = useAuth();
  const { addToCart, getTotalItems } = useCart({ userId: user?.id });
  const { toggleFavorite } = useFavorites({ userId: user?.id });

  // Animação do banner
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => {
        const next = (prev + 1) % banners.length;
        if (bannerScrollRef.current) {
          bannerScrollRef.current.scrollTo({
            x: next * SCREEN_WIDTH,
            animated: true,
          });
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Função para atualizar o índice do banner
  const onScrollBanner = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setBannerIndex(page);
  };

  // Função para abrir drawer
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  // Função para fechar drawer
  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -drawerWidth,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setDrawerOpen(false));
  };

  // Função para adicionar ao carrinho
  const handleAddToCart = (product: any) => {
    setLoading(true);
    addToCart({
      id: product.id,
      nome: product.nome,
      preco: parseFloat(product.preco.replace('R$ ', '').replace(',', '.')),
      precoOriginal: product.precoOriginal ? parseFloat(product.precoOriginal.replace('R$ ', '').replace(',', '.')) : undefined,
      imagem: product.imagem,
      categoria: product.categoria,
      peso: product.peso,
      dimensoes: product.dimensoes,
      emPromocao: product.emPromocao,
      desconto: product.precoOriginal ? 
        Math.round((1 - parseFloat(product.preco.replace('R$ ', '').replace(',', '.')) / parseFloat(product.precoOriginal.replace('R$ ', '').replace(',', '.'))) * 100) : 0
    } as any);
    
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        '✅ Adicionado!', 
        `${product.nome} foi adicionado ao carrinho!`,
        [{ text: 'OK', style: 'default' }]
      );
    }, 500);
  };

  // Função para toggle favorito
  const handleToggleFavorite = (product: any) => {
    toggleFavorite(product);
  };

  // Função para compartilhar produto
  const handleShare = (product: any) => {
    Alert.alert(
      'Compartilhar',
      `Compartilhar ${product.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'WhatsApp', onPress: () => console.log('Compartilhar no WhatsApp') },
        { text: 'Instagram', onPress: () => console.log('Compartilhar no Instagram') }
      ]
    );
  };

  // Função de refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Função para controlar o scroll e mostrar/ocultar sticky search
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const shouldShow = offsetY > 80; // Mostra quando scroll > 80px
    
    if (shouldShow !== showStickySearch) {
      setShowStickySearch(shouldShow);
      
      // Animar a entrada/saída do sticky header
      Animated.parallel([
        Animated.timing(stickyOpacity, {
          toValue: shouldShow ? 1 : 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(stickyTranslateY, {
          toValue: shouldShow ? 0 : -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Filtrar produtos por busca
  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchText.toLowerCase())
  );

  // Produtos em destaque (primeiros 4)
  const produtosDestaque = produtosFiltrados.slice(0, 4);
  
  // Produtos recomendados (próximos 4)
  const produtosRecomendados = produtosFiltrados.slice(4, 8);

  return (
    <LinearGradient
      colors={[Colors.background, '#f8fafc', '#f1f5f9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <Drawer 
          isOpen={drawerOpen} 
          onClose={closeDrawer} 
          drawerAnim={drawerAnim} 
          drawerWidth={drawerWidth} 
        />

<Header 
  title="Ecological Construction" 
  onMenuPress={openDrawer}
  isMenuOpen={drawerOpen}
          rightButton={{
            icon: 'shopping-cart',
            onPress: () => router.push('/(tabs)/carrinho'),
            badge: getTotalItems()
          }}
/>

        {/* Sticky Search Bar */}
        <Animated.View 
          style={[
            styles.stickySearchContainer,
            {
              opacity: stickyOpacity,
              transform: [{ translateY: stickyTranslateY }],
              zIndex: drawerOpen ? 3 : 5
            }
          ]}
          pointerEvents={showStickySearch ? 'auto' : 'none'}
        >
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar produtos sustentáveis..."
            showFilter={true}
            showVoice={true}
            onFilterPress={() => Alert.alert('Filtros', 'Funcionalidade em desenvolvimento')}
            onVoicePress={() => console.log('Voice search started')}
            onVoiceResult={(text) => {
              console.log('Voice result:', text);
            }}
          />
        </Animated.View>

        <ScrollView 
          ref={mainScrollRef}
          style={{ flex: 1 }} 
          contentContainerStyle={{ paddingBottom: 100 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#f59e42"
              colors={['#f59e42']}
              progressBackgroundColor="transparent"
              style={{ backgroundColor: 'transparent' }}
            />
          }
        >
          {/* Search Bar Normal */}
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar produtos sustentáveis..."
            showFilter={true}
            showVoice={true}
            onFilterPress={() => Alert.alert('Filtros', 'Funcionalidade em desenvolvimento')}
            onVoicePress={() => console.log('Voice search started')}
            onVoiceResult={(text) => {
              console.log('Voice result:', text);
            }}
          />

          {/* Hero Section com Carrossel */}
          <View style={styles.heroSection}>
              <ScrollView
                ref={bannerScrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScrollBanner}
                scrollEventThrottle={16}
              style={styles.carouselContainer}
            >
              {banners.map((banner) => (
                <View key={banner.id} style={styles.bannerCard}>
                  <Image source={banner.imagem} style={styles.bannerImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.bannerGradient}
                  />
                  <View style={styles.bannerContent}>
                    <View style={[styles.bannerBadge, { backgroundColor: banner.cor }]}>
                      <Text style={styles.bannerBadgeText}>{banner.desconto}</Text>
                    </View>
                    <Text style={styles.bannerTitle}>{banner.titulo}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitulo}</Text>
                    <Button
                      title="Ver Ofertas"
                      onPress={() => router.push('/(tabs)/produto')}
                      variant="outline"
                      size="small"
                      style={styles.bannerButton}
                    />
                  </View>
                  </View>
                ))}
              </ScrollView>
            
            {/* Indicadores do carrossel */}
            <View style={styles.carouselIndicators}>
                {banners.map((_, idx) => (
                  <View
                    key={idx}
                  style={[
                    styles.indicator,
                    bannerIndex === idx && styles.indicatorActive
                  ]}
                  />
                ))}
            </View>
          </View>

          {/* Estatísticas da Empresa */}
          <View style={styles.statsSection}>
            <Card variant="elevated" style={styles.statsCard}>
              <Text style={styles.statsTitle}>Nossa Empresa em Números</Text>
              <View style={styles.statsGrid}>
                {estatisticas.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <MaterialCommunityIcons 
                      name={stat.icon as any} 
                      size={24} 
                      color={Colors.primary} 
                    />
                    <Text style={styles.statNumber}>{stat.numero}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
                ))}
              </View>
            </Card>
          </View>

          {/* Categorias */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="category" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Categorias</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.categoriasScroll}
              contentContainerStyle={styles.categoriasContent}
            >
              {categorias.map((categoria) => (
                <TouchableOpacity 
                  key={categoria.id}
                  style={styles.categoriaCard}
                  onPress={() => router.push('/(tabs)/produto')}
                >
                  <View style={[styles.categoriaIcon, { backgroundColor: categoria.cor + '20' }]}>
                    <MaterialCommunityIcons 
                      name={categoria.icon as any} 
                      size={28} 
                      color={categoria.cor} 
                    />
              </View>
                  <Text style={styles.categoriaNome}>{categoria.nome}</Text>
                  <Text style={styles.categoriaDescricao}>{categoria.descricao}</Text>
                  <Text style={styles.categoriaProdutos}>{categoria.produtos} produtos</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Benefícios */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="star" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Por que escolher a EcoBrick?</Text>
            </View>
            <View style={styles.beneficiosGrid}>
              {beneficios.map((beneficio, index) => (
                <Card key={index} variant="outlined" style={styles.beneficioCard}>
                  <View style={[styles.beneficioIcon, { backgroundColor: beneficio.cor + '20' }]}>
                    <MaterialCommunityIcons 
                      name={beneficio.icon as any} 
                      size={24} 
                      color={beneficio.cor} 
                    />
                </View>
                  <Text style={styles.beneficioLabel}>{beneficio.label}</Text>
                  <Text style={styles.beneficioDescricao}>{beneficio.descricao}</Text>
                </Card>
              ))}
            </View>
          </View>

          {/* Produtos em Destaque */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="local-fire-department" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Produtos em Destaque</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/produto')}>
                <Text style={styles.verTodos}>Ver todos</Text>
                  </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.produtosScroll}
              contentContainerStyle={styles.produtosContent}
            >
              {produtosDestaque.map((produto) => (
                <View key={produto.id} style={styles.productCardContainer}>
                  <ProductCard
                    product={produto}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    onShare={handleShare}
                    variant="vertical"
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Produtos Recomendados */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="recommend" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Recomendados para Você</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/produto')}>
                <Text style={styles.verTodos}>Ver todos</Text>
                  </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.produtosScroll}
              contentContainerStyle={styles.produtosContent}
            >
              {produtosRecomendados.map((produto) => (
                <View key={produto.id} style={styles.productCardContainer}>
                  <ProductCard
                    product={produto}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    onShare={handleShare}
                    variant="vertical"
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Newsletter e Contato */}
          <View style={styles.newsletterSection}>
            <Card variant="elevated" style={styles.newsletterCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.newsletterGradient}
              >
                <View style={styles.newsletterContent}>
                  <MaterialCommunityIcons 
                    name="email-newsletter" 
                    size={40} 
                    color="#fff" 
                  />
                  <Text style={styles.newsletterTitle}>Fique por Dentro!</Text>
                  <Text style={styles.newsletterSubtitle}>
                    Receba ofertas exclusivas e novidades sobre sustentabilidade
                  </Text>
                  <View style={styles.newsletterForm}>
                    <View style={styles.emailInput}>
                      <MaterialCommunityIcons name="email" size={20} color="#666" />
                      <Text style={styles.emailPlaceholder}>Seu melhor e-mail</Text>
            </View>
                    <TouchableOpacity style={styles.subscribeButton}>
                      <Text style={styles.subscribeText}>Inscrever</Text>
                    </TouchableOpacity>
                </View>
                </View>
              </LinearGradient>
            </Card>
                </View>

          {/* Seção de Contato e Suporte */}
          <View style={styles.contactSection}>
            <Card variant="elevated" style={styles.contactCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.contactGradient}
              >
                <View style={styles.contactContent}>
                  <MaterialCommunityIcons 
                    name="headset" 
                    size={48} 
                    color="#fff" 
                  />
                  <Text style={styles.contactTitle}>Precisa de Ajuda?</Text>
                  <Text style={styles.contactSubtitle}>
                    Nossa equipe especializada está pronta para te ajudar com qualquer dúvida sobre nossos produtos sustentáveis
                  </Text>
                  <View style={styles.contactButtons}>
                    <TouchableOpacity style={styles.whatsappButton}>
                      <MaterialCommunityIcons name="whatsapp" size={20} color="#fff" />
                      <Text style={styles.whatsappText}>WhatsApp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.emailButton}>
                      <MaterialCommunityIcons name="email" size={20} color="#667eea" />
                      <Text style={styles.emailText}>E-mail</Text>
                    </TouchableOpacity>
                  </View>
                  </View>
              </LinearGradient>
            </Card>
                  </View>

          {/* Redes Sociais */}
          <View style={styles.socialSection}>
            <Card variant="outlined" style={styles.socialCard}>
              <Text style={styles.socialTitle}>Siga-nos nas Redes Sociais</Text>
              <Text style={styles.socialSubtitle}>
                Acompanhe nossas novidades e dicas de sustentabilidade
              </Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#25D366' }]}>
                  <MaterialCommunityIcons name="whatsapp" size={20} color="#fff" />
                  <Text style={styles.socialButtonText}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#E4405F' }]}>
                  <MaterialCommunityIcons name="instagram" size={20} color="#fff" />
                  <Text style={styles.socialButtonText}>Instagram</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1877F2' }]}>
                  <MaterialCommunityIcons name="facebook" size={20} color="#fff" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
                  </View>
            </Card>
                  </View>

          {/* Seção de Garantia e Qualidade */}
          <View style={styles.guaranteeSection}>
            <Card variant="elevated" style={styles.guaranteeCard}>
              <View style={styles.guaranteeContent}>
                <View style={styles.guaranteeItem}>
                  <MaterialCommunityIcons name="shield-check" size={32} color={Colors.primary} />
                  <Text style={styles.guaranteeTitle}>Garantia Total</Text>
                  <Text style={styles.guaranteeDesc}>12 meses de garantia</Text>
                </View>
                <View style={styles.guaranteeItem}>
                  <MaterialCommunityIcons name="truck-fast" size={32} color={Colors.secondary} />
                  <Text style={styles.guaranteeTitle}>Entrega Rápida</Text>
                  <Text style={styles.guaranteeDesc}>Até 48h em todo Brasil</Text>
            </View>
                <View style={styles.guaranteeItem}>
                  <MaterialCommunityIcons name="recycle" size={32} color={Colors.accent} />
                  <Text style={styles.guaranteeTitle}>100% Sustentável</Text>
                  <Text style={styles.guaranteeDesc}>Materiais ecológicos</Text>
          </View>
              </View>
            </Card>
          </View>

        </ScrollView>

        {loading && <Loading overlay message="Adicionando ao carrinho..." />}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Sticky Search
  stickySearchContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  // Hero Section
  heroSection: {
    marginBottom: 24,
  },
  carouselContainer: {
    height: 200,
  },
  bannerCard: {
    width: SCREEN_WIDTH,
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'flex-start',
  },
  bannerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  bannerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Typography.fontFamily,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    fontFamily: Typography.fontFamily,
    marginBottom: 4,
    lineHeight: 28,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: Typography.fontFamily,
    marginBottom: 12,
    opacity: 0.9,
    lineHeight: 22,
  },
  bannerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#fff',
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border.medium,
    marginHorizontal: 4,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },

  // Estatísticas
  statsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  statsCard: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: Typography.fontFamily,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginTop: 4,
  },

  // Seções
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginLeft: 8,
    flex: 1,
    lineHeight: 26,
  },
  verTodos: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: Typography.fontFamily,
    fontWeight: '600',
  },

  // Categorias
  categoriasScroll: {
    paddingLeft: 16,
  },
  categoriasContent: {
    paddingRight: 16,
  },
  categoriaCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 100,
  },
  categoriaIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoriaNome: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginBottom: 2,
  },
  categoriaDescricao: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginBottom: 2,
  },
  categoriaProdutos: {
    fontSize: 10,
    color: Colors.primary,
    fontFamily: Typography.fontFamily,
    fontWeight: '600',
  },

  // Benefícios
  beneficiosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  beneficioCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  beneficioIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  beneficioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginBottom: 4,
  },
  beneficioDescricao: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
  },

  // Produtos
  produtosScroll: {
    paddingLeft: 16,
  },
  produtosContent: {
    paddingRight: 16,
  },
  productCardContainer: {
    width: 170,
    marginRight: 10,
  },

  // Newsletter
  newsletterSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  newsletterCard: {
    overflow: 'hidden',
  },
  newsletterGradient: {
    padding: 24,
  },
  newsletterContent: {
    alignItems: 'center',
  },
  newsletterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Typography.fontFamily,
    marginTop: 12,
    marginBottom: 8,
  },
  newsletterSubtitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
    lineHeight: 22,
  },
  newsletterForm: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  emailInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emailPlaceholder: {
    fontSize: 14,
    color: '#666',
    fontFamily: Typography.fontFamily,
  },
  subscribeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  subscribeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Typography.fontFamily,
  },

  // Contato e Suporte
  contactSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  contactCard: {
    overflow: 'hidden',
  },
  contactGradient: {
    padding: 24,
  },
  contactContent: {
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    fontFamily: Typography.fontFamily,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 22,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    gap: 8,
  },
  whatsappText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Typography.fontFamily,
  },
  emailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  emailText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Typography.fontFamily,
  },

  // Redes Sociais
  socialSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  socialCard: {
    padding: 20,
  },
  socialTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginBottom: 8,
  },
  socialSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 8,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Typography.fontFamily,
  },

  // Garantia e Qualidade
  guaranteeSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  guaranteeCard: {
    padding: 20,
  },
  guaranteeContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  guaranteeItem: {
    alignItems: 'center',
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  guaranteeDesc: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    lineHeight: 16,
  },

});