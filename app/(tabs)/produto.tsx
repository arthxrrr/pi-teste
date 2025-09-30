import { Drawer } from '@/components/Drawer';
import { Header } from '@/components/Header';
import { ProductCardGrid } from '@/components/ProductCardGrid';
import { SearchBar } from '@/components/SearchBar';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const produtos = [
  { 
    id: '1', 
    nome: 'Tijolo Ecológico', 
    preco: 'R$ 2,50', 
    precoOriginal: 'R$ 3,00',
    status: 'Disponível', 
    categoria: 'Tijolos',
    caracteristicas: ['Sustentável', 'Alta resistência', 'Fácil de assentar'], 
    descricao: 'Tijolo ecológico feito com material reciclado, oferecendo resistência superior e contribuindo para a preservação do meio ambiente.',
    especificacoes: {
      dimensoes: '19 x 9 x 9 cm',
      peso: '2,5 kg',
      resistencia: '15 MPa',
      absorcao: '8%',
      cor: 'Terracota natural'
    },
    avaliacao: 4.8,
    numAvaliacoes: 127,
    imagem: require('@/assets/images/tijolo.png'),
    imagens: [
      require('@/assets/images/tijolo.png'),
      require('@/assets/images/tijolo-ilus-quadrado2.jpg')
    ],
    emPromocao: true,
    estoque: 150,
    favorito: false
  },
  { 
    id: '2', 
    nome: 'Tijolo Quadrado', 
    preco: 'R$ 3,00', 
    precoOriginal: null,
    status: 'Poucas unidades', 
    categoria: 'Tijolos',
    caracteristicas: ['Formato quadrado', 'Ideal para muros', 'Acabamento premium'], 
    descricao: 'Tijolo quadrado para acabamentos diferenciados, perfeito para projetos arquitetônicos modernos.',
    especificacoes: {
      dimensoes: '20 x 20 x 9 cm',
      peso: '3,2 kg',
      resistencia: '18 MPa',
      absorcao: '6%',
      cor: 'Terracota clara'
    },
    avaliacao: 4.6,
    numAvaliacoes: 89,
    imagem: require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
    imagens: [
      require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
      require('@/assets/images/tijolo.png')
    ],
    emPromocao: false,
    estoque: 8,
    favorito: false
  },
  { 
    id: '3', 
    nome: 'Tijolo Retangular', 
    preco: 'R$ 3,20', 
    precoOriginal: null,
    status: 'Disponível', 
    categoria: 'Tijolos',
    caracteristicas: ['Formato retangular', 'Versátil', 'Fácil instalação'], 
    descricao: 'Tijolo retangular para diversas aplicações, desde construções residenciais até projetos comerciais.',
    especificacoes: {
      dimensoes: '25 x 12 x 9 cm',
      peso: '3,8 kg',
      resistencia: '20 MPa',
      absorcao: '7%',
      cor: 'Terracota escura'
    },
    avaliacao: 4.7,
    numAvaliacoes: 203,
    imagem: require('@/assets/images/tijolo-ilus-retangulo.jpg'),
    imagens: [
      require('@/assets/images/tijolo-ilus-retangulo.jpg'),
      require('@/assets/images/tijolo.png')
    ],
    emPromocao: false,
    estoque: 75,
    favorito: false
  },
  { 
    id: '4', 
    nome: 'Vaso Quadrado', 
    preco: 'R$ 12,00', 
    precoOriginal: 'R$ 15,00',
    status: 'Disponível', 
    categoria: 'Decoração',
    caracteristicas: ['Decoração', 'Resistente', 'Drenagem otimizada'], 
    descricao: 'Vaso quadrado feito com tijolo ecológico, ideal para plantas ornamentais e decoração de ambientes.',
    especificacoes: {
      dimensoes: '25 x 25 x 20 cm',
      peso: '4,5 kg',
      capacidade: '8 litros',
      drenagem: '4 furos',
      cor: 'Terracota natural'
    },
    avaliacao: 4.9,
    numAvaliacoes: 156,
    imagem: require('@/assets/images/vaso-quadrado.jpg'),
    imagens: [
      require('@/assets/images/vaso-quadrado.jpg'),
      require('@/assets/images/vaso-quadrado2.jpg')
    ],
    emPromocao: true,
    estoque: 45,
    favorito: false
  },
  { 
    id: '5', 
    nome: 'Vaso Retangular', 
    preco: 'R$ 18,00', 
    precoOriginal: null,
    status: 'Esgotado', 
    categoria: 'Decoração',
    caracteristicas: ['Decoração', 'Grande porte', 'Design moderno'], 
    descricao: 'Vaso retangular para jardins, perfeito para plantas de maior porte e decoração de espaços externos.',
    especificacoes: {
      dimensoes: '40 x 20 x 25 cm',
      peso: '7,2 kg',
      capacidade: '15 litros',
      drenagem: '6 furos',
      cor: 'Terracota escura'
    },
    avaliacao: 4.8,
    numAvaliacoes: 98,
    imagem: require('@/assets/images/vaso-retangular.jpg'),
    imagens: [
      require('@/assets/images/vaso-retangular.jpg'),
      require('@/assets/images/vaso-quadrado.jpg')
    ],
    emPromocao: false,
    estoque: 0,
    favorito: false
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const drawerWidth = SCREEN_WIDTH * 0.7;

export default function ProdutosScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnim] = useState(new Animated.Value(-drawerWidth));
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('nome');
  const [showFilters, setShowFilters] = useState(false);
  const [, setProdutosData] = useState(produtos);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 1000});
  const [showPromotions, setShowPromotions] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  const scrollRef = useRef<FlatList>(null);
  
  // Animações
  const filtersAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef<Animated.Value[]>([]).current;

  const categorias = ['Todos', 'Tijolos', 'Decoração'];
  const sortOptions = [
    { key: 'nome', label: 'Nome', icon: 'sort-alphabetical-ascending' },
    { key: 'preco', label: 'Preço', icon: 'sort-numeric-ascending' },
    { key: 'avaliacao', label: 'Avaliação', icon: 'star' },
    { key: 'estoque', label: 'Estoque', icon: 'package-variant' }
  ];

  // Inicializar animações
  useEffect(() => {
    listAnim.setValue(1);
    animateCards();
  }, [viewMode, searchText, selectedCategory, sortBy, showPromotions, inStock]);

  // Função de refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Função para alternar modo de visualização
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
    // Animação de transição
    Animated.sequence([
      Animated.timing(listAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Função para animar filtros
  const animateFilters = () => {
    if (showFilters) {
      Animated.timing(filtersAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(filtersAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Função para animar cards
  const animateCards = () => {
    const filteredProducts = getFilteredProducts();
    cardAnimations.length = 0;
    
    filteredProducts.forEach((_, index) => {
      const animValue = new Animated.Value(0);
      cardAnimations.push(animValue);
      
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  };

  // Função para filtrar e ordenar produtos
  const getFilteredProducts = () => {
    let filtered = produtos.filter(produto => {
      const matchesSearch = produto.nome.toLowerCase().includes(searchText.toLowerCase()) ||
                           produto.descricao.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || produto.categoria === selectedCategory;
      
      // Filtros adicionais
      const productPrice = parseFloat(produto.preco.replace('R$ ', '').replace(',', '.'));
      const matchesPrice = productPrice >= priceRange.min && productPrice <= priceRange.max;
      const matchesPromotions = !showPromotions || produto.emPromocao;
      const matchesStock = !inStock || produto.estoque > 0;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesPromotions && matchesStock;
    });

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'preco':
          return parseFloat(a.preco.replace('R$ ', '').replace(',', '.')) - 
                 parseFloat(b.preco.replace('R$ ', '').replace(',', '.'));
        case 'avaliacao':
          return b.avaliacao - a.avaliacao;
        case 'estoque':
          return b.estoque - a.estoque;
        case 'nome':
        default:
          return a.nome.localeCompare(b.nome);
      }
    });

    return filtered;
  };

  const toggleFavorito = (id: string) => {
    setProdutosData((prev: any[]) => prev.map((produto: any) => 
      produto.id === id ? { ...produto, favorito: !produto.favorito } : produto
    ));
  };

  const handleComprar = (produto: any) => {
    if (produto.estoque === 0) {
      Alert.alert('Produto Esgotado', 'Este produto está temporariamente fora de estoque.');
      return;
    }
    Alert.alert('Adicionado ao Carrinho', `${produto.nome} foi adicionado ao seu carrinho!`);
  };

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -drawerWidth,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setDrawerOpen(false));
  };


  const renderItem = ({ item }: any) => (
    <ProductCardGrid
      product={item}
      onToggleFavorite={toggleFavorito}
      onAddToCart={handleComprar}
      onShare={(product) => Alert.alert('Compartilhar', `Compartilhando ${product.nome}`)}
      size={viewMode === 'grid' ? 'small' : 'medium'}
      showRating={viewMode === 'list'}
    />
  );

  return (
    <View style={styles.container}>
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
          badge: 3
        }}
      />

      <SearchBar
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          setHasSearched(text.length > 0);
          if (text.length > 0) {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 500);
          }
        }}
        placeholder="Pesquisar produtos..."
        onFilterPress={() => {
          setShowFilters(!showFilters);
          animateFilters();
        }}
        showFilter={true}
        showVoice={true}
      />

      {/* Filtros Modernos */}
      {showFilters && (
        <Animated.View
          style={[
            styles.filtersContainer,
            {
              opacity: filtersAnim,
              transform: [{
                translateY: filtersAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                })
              }]
            }
          ]}
        >
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.filtersGradient}
          >
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria}
                style={[
                  styles.categoryButton,
                  selectedCategory === categoria && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(categoria)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === categoria && styles.categoryButtonTextActive
                ]}>
                  {categoria}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.controlsContainer}>
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Ordenar por:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortOptionButton,
                      sortBy === option.key && styles.sortOptionButtonActive
                    ]}
                    onPress={() => setSortBy(option.key)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons 
                      name={option.icon as any} 
                      size={14} 
                      color={sortBy === option.key ? Colors.text.inverse : Colors.text.secondary} 
                    />
                    <Text style={[
                      styles.sortOptionText,
                      sortBy === option.key && styles.sortOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <TouchableOpacity 
              style={styles.viewModeButton}
              onPress={toggleViewMode}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name={viewMode === 'grid' ? 'view-grid' : 'view-list'} 
                size={20} 
                color={Colors.primary} 
              />
            </TouchableOpacity>
          </View>

          {/* Filtros adicionais */}
          <View style={styles.additionalFilters}>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[
                  styles.filterToggle,
                  showPromotions && styles.filterToggleActive
                ]}
                onPress={() => setShowPromotions(!showPromotions)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons 
                  name="tag" 
                  size={16} 
                  color={showPromotions ? Colors.text.inverse : Colors.text.secondary} 
                />
                <Text style={[
                  styles.filterToggleText,
                  showPromotions && styles.filterToggleTextActive
                ]}>
                  Promoções
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterToggle,
                  inStock && styles.filterToggleActive
                ]}
                onPress={() => setInStock(!inStock)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons 
                  name="package-variant" 
                  size={16} 
                  color={inStock ? Colors.text.inverse : Colors.text.secondary} 
                />
                <Text style={[
                  styles.filterToggleText,
                  inStock && styles.filterToggleTextActive
                ]}>
                  Em Estoque
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.priceRangeContainer}>
              <Text style={styles.priceRangeLabel}>
                Faixa de Preço: R$ {priceRange.min} - R$ {priceRange.max}
              </Text>
            </View>
          </View>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Lista de produtos moderna */}
      <Animated.View
        style={[
          styles.listContainer,
          {
            opacity: listAnim,
            transform: [{
              scale: listAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              })
            }]
          }
        ]}
      >
        <FlatList
          ref={scrollRef}
          data={getFilteredProducts()}
          numColumns={viewMode === 'grid' ? 2 : 1}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.lista,
            viewMode === 'grid' && styles.gridList
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
              progressBackgroundColor="transparent"
            />
          }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name={hasSearched ? "magnify" : "package-variant"} 
              size={64} 
              color={Colors.text.secondary} 
            />
            <Text style={styles.emptyText}>
              {hasSearched ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
            </Text>
            <Text style={styles.emptySubtext}>
              {hasSearched 
                ? 'Tente ajustar os filtros ou termo de busca' 
                : 'Verifique os filtros aplicados ou tente novamente mais tarde'
              }
            </Text>
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={() => {
                setSearchText('');
                setSelectedCategory('Todos');
                setSortBy('nome');
                setPriceRange({min: 0, max: 1000});
                setShowPromotions(false);
                setInStock(false);
                setHasSearched(false);
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="refresh" size={16} color={Colors.text.inverse} />
              <Text style={styles.clearFiltersText}>Limpar Filtros</Text>
            </TouchableOpacity>
          </View>
        }
        ListHeaderComponent={
          getFilteredProducts().length > 0 ? (
            <View style={styles.resultsHeader}>
              <View style={styles.resultsInfo}>
                <Text style={styles.resultsCount}>
                  {getFilteredProducts().length} produto{getFilteredProducts().length !== 1 ? 's' : ''} encontrado{getFilteredProducts().length !== 1 ? 's' : ''}
                </Text>
                {isLoading && (
                  <View style={styles.loadingIndicator}>
                    <MaterialCommunityIcons name="loading" size={16} color={Colors.primary} />
                    <Text style={styles.loadingText}>Buscando...</Text>
                  </View>
                )}
              </View>
              {hasSearched && (
                <TouchableOpacity 
                  style={styles.clearSearchButton}
                  onPress={() => {
                    setSearchText('');
                    setHasSearched(false);
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="close" size={16} color={Colors.text.secondary} />
                  <Text style={styles.clearSearchText}>Limpar busca</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        }
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  filtersGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  listContainer: {
    flex: 1,
  },
  categoriesScroll: {
    marginBottom: Spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.light,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadows.medium,
  },
  categoryButtonText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
    letterSpacing: 0.3,
  },
  categoryButtonTextActive: {
    color: Colors.text.inverse,
    fontWeight: Typography.weights.semibold,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sortLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
    marginRight: Spacing.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.light,
  },
  sortButtonText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
    marginRight: Spacing.xs,
  },
  viewModeButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginLeft: Spacing.sm,
    ...Shadows.light,
  },
  lista: { 
    paddingBottom: 120, 
    paddingHorizontal: Spacing.md, 
    paddingTop: Spacing.md,
  },
  gridList: {
    paddingHorizontal: Spacing.sm,
  },
  resultsHeader: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsInfo: {
    flex: 1,
  },
  resultsCount: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  loadingText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
  },
  clearSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.border.light,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  clearSearchText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.sizes.xl,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.semibold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Typography.sizes.md,
    color: Colors.text.tertiary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.md,
    marginBottom: Spacing.lg,
  },
  clearFiltersButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.medium,
  },
  clearFiltersText: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 0.3,
  },
  sortScroll: {
    flex: 1,
  },
  sortOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginRight: Spacing.sm,
    gap: Spacing.xs,
  },
  sortOptionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadows.medium,
  },
  sortOptionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
  },
  sortOptionTextActive: {
    color: Colors.text.inverse,
    fontWeight: Typography.weights.semibold,
  },
  additionalFilters: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing.xs,
    flex: 1,
  },
  filterToggleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadows.medium,
  },
  filterToggleText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
  },
  filterToggleTextActive: {
    color: Colors.text.inverse,
    fontWeight: Typography.weights.semibold,
  },
  priceRangeContainer: {
    paddingVertical: Spacing.sm,
  },
  priceRangeLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
});
