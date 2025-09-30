import { Drawer } from '@/components/Drawer';
import { Header } from '@/components/Header';
import { ThemedView } from '@/components/ThemedView';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const drawerWidth = SCREEN_WIDTH * 0.7;

// Dados de exemplo do carrinho
const carrinhoItems = [
  {
    id: '1',
    nome: 'Tijolo Ecológico',
    preco: 2.50,
    precoOriginal: 3.00,
    quantidade: 3,
    imagem: require('@/assets/images/tijolo.png'),
    categoria: 'Tijolos',
    peso: '2,5 kg',
    dimensoes: '19 x 9 x 9 cm',
    emPromocao: true,
    desconto: 17
  },
  {
    id: '4',
    nome: 'Vaso Quadrado',
    preco: 12.00,
    precoOriginal: 15.00,
    quantidade: 1,
    imagem: require('@/assets/images/vaso-quadrado.jpg'),
    categoria: 'Decoração',
    peso: '4,5 kg',
    dimensoes: '25 x 25 x 20 cm',
    emPromocao: true,
    desconto: 20
  },
  {
    id: '2',
    nome: 'Tijolo Quadrado',
    preco: 3.00,
    precoOriginal: null,
    quantidade: 2,
    imagem: require('@/assets/images/tijolo-ilus-quadrado2.jpg'),
    categoria: 'Tijolos',
    peso: '3,2 kg',
    dimensoes: '20 x 20 x 9 cm',
    emPromocao: false,
    desconto: 0
  }
];

const cuponsDisponiveis = [
  { codigo: 'ECO10', desconto: 10, descricao: '10% de desconto em produtos ecológicos' },
  { codigo: 'PRIMEIRA', desconto: 15, descricao: '15% de desconto na primeira compra' },
  { codigo: 'FRETE', desconto: 0, descricao: 'Frete grátis para compras acima de R$ 50' }
];

export default function CarrinhoScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnim] = useState(new Animated.Value(-drawerWidth));
  const [carrinho, setCarrinho] = useState(carrinhoItems);
  const [cupomAplicado, setCupomAplicado] = useState<string | null>(null);
  const [cupomInput, setCupomInput] = useState('');
  const [mostrarCupons, setMostrarCupons] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  
  // Animações
  const itemAnimations = useRef<Animated.Value[]>([]).current;
  const summaryAnim = useRef(new Animated.Value(0)).current;

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

  // Função de refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Função para animar itens
  const animateItems = () => {
    itemAnimations.length = 0;
    carrinho.forEach((_, index) => {
      const animValue = new Animated.Value(0);
      itemAnimations.push(animValue);
      
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  };

  // Inicializar animações
  useEffect(() => {
    animateItems();
    Animated.timing(summaryAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [carrinho]);

  const atualizarQuantidade = (id: string, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerItem(id);
      return;
    }
    setCarrinho(prev => prev.map(item => 
      item.id === id ? { ...item, quantidade: novaQuantidade } : item
    ));
  };

  const removerItem = (id: string) => {
    Alert.alert(
      'Remover Item',
      'Tem certeza que deseja remover este item do carrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => setCarrinho(prev => prev.filter(item => item.id !== id))
        }
      ]
    );
  };

  const aplicarCupom = () => {
    const cupom = cuponsDisponiveis.find(c => c.codigo.toUpperCase() === cupomInput.toUpperCase());
    if (cupom) {
      setCupomAplicado(cupom.codigo);
      setCupomInput('');
      Alert.alert('Cupom Aplicado!', cupom.descricao);
    } else {
      Alert.alert('Cupom Inválido', 'O cupom inserido não é válido ou já foi utilizado.');
    }
  };

  const removerCupom = () => {
    setCupomAplicado(null);
  };

  const calcularSubtotal = () => {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const calcularDesconto = () => {
    if (!cupomAplicado) return 0;
    const cupom = cuponsDisponiveis.find(c => c.codigo === cupomAplicado);
    if (!cupom) return 0;
    
    if (cupom.codigo === 'FRETE') return 0; // Frete grátis
    return (calcularSubtotal() * cupom.desconto) / 100;
  };

  const calcularFrete = () => {
    if (cupomAplicado === 'FRETE') return 0;
    const subtotal = calcularSubtotal();
    if (subtotal >= 50) return 0;
    return 15.00;
  };

  const calcularTotal = () => {
    return calcularSubtotal() - calcularDesconto() + calcularFrete();
  };

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      Alert.alert('Carrinho Vazio', 'Adicione itens ao carrinho antes de finalizar a compra.');
      return;
    }
    
    Alert.alert(
      'Finalizar Compra',
      `Total: R$ ${calcularTotal().toFixed(2)}\n\nDeseja prosseguir com o pagamento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            Alert.alert('Compra Realizada!', 'Sua compra foi processada com sucesso. Você receberá um email de confirmação em breve.');
            setCarrinho([]);
            setCupomAplicado(null);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <ThemedView card style={styles.cartItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Image source={item.imagem} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemCategoria}>{item.categoria}</Text>
            <Text style={styles.itemNome}>{item.nome}</Text>
            <View style={styles.itemSpecs}>
              <Text style={styles.specText}>{item.dimensoes}</Text>
              <Text style={styles.specText}>• {item.peso}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removerItem(item.id)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.itemFooter}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => atualizarQuantidade(item.id, item.quantidade - 1)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="minus" size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantidade}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => atualizarQuantidade(item.id, item.quantidade + 1)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="plus" size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.priceContainer}>
          {item.emPromocao && (
            <Text style={styles.originalPrice}>R$ {item.precoOriginal?.toFixed(2)}</Text>
          )}
          <Text style={styles.currentPrice}>R$ {item.preco.toFixed(2)}</Text>
          <Text style={styles.totalPrice}>
            R$ {(item.preco * item.quantidade).toFixed(2)}
          </Text>
        </View>
      </View>
    </ThemedView>
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
          icon: 'heart',
          onPress: () => router.push('/(tabs)/perfil')
        }}
      />

      {carrinho.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="cart-outline" size={80} color={Colors.text.tertiary} />
          <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
          <Text style={styles.emptySubtitle}>Adicione produtos sustentáveis para começar suas compras</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => router.push('/(tabs)/produto')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="shopping" size={20} color={Colors.text.inverse} />
            <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          ref={scrollRef}
          style={styles.content} 
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
        >
          {/* Resumo do Carrinho */}
          <Animated.View 
            style={[
              styles.summaryCard,
              {
                opacity: summaryAnim,
                transform: [{
                  translateY: summaryAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })
                }]
              }
            ]}
          >
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              style={styles.summaryGradient}
            >
              <View style={styles.summaryHeader}>
                <MaterialCommunityIcons name="shopping" size={24} color={Colors.primary} />
                <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
              </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Itens ({carrinho.reduce((total, item) => total + item.quantidade, 0)})</Text>
              <Text style={styles.summaryValue}>R$ {calcularSubtotal().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Frete</Text>
              <Text style={styles.summaryValue}>
                {calcularFrete() === 0 ? 'Grátis' : `R$ ${calcularFrete().toFixed(2)}`}
              </Text>
            </View>
            {calcularDesconto() > 0 && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Desconto</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -R$ {calcularDesconto().toFixed(2)}
                </Text>
              </View>
            )}
            <View style={[styles.summaryItem, styles.totalItem]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {calcularTotal().toFixed(2)}</Text>
            </View>
            </LinearGradient>
          </Animated.View>

          {/* Cupom de Desconto */}
          <View style={styles.cupomCard}>
            <LinearGradient
              colors={['#ffffff', '#fef3c7']}
              style={styles.cupomGradient}
            >
              <View style={styles.cupomHeader}>
                <MaterialCommunityIcons name="tag" size={24} color={Colors.primary} />
                <Text style={styles.cupomTitle}>Cupom de Desconto</Text>
              </View>
            
            {cupomAplicado ? (
              <View style={styles.cupomAplicado}>
                <View style={styles.cupomAplicadoInfo}>
                            <MaterialCommunityIcons name="check-circle" size={18} color={Colors.primary} />
                  <Text style={styles.cupomAplicadoText}>{cupomAplicado} aplicado</Text>
                </View>
                <TouchableOpacity onPress={removerCupom} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="close-circle" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cupomInputContainer}>
                <TextInput
                  style={styles.cupomInput}
                  placeholder="Digite o código do cupom"
                  value={cupomInput}
                  onChangeText={setCupomInput}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity style={styles.cupomButton} onPress={aplicarCupom}>
                  <Text style={styles.cupomButtonText}>Aplicar</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.cuponsDisponiveisButton}
              onPress={() => setMostrarCupons(!mostrarCupons)}
              activeOpacity={0.7}
            >
              <Text style={styles.cuponsDisponiveisText}>
                {mostrarCupons ? 'Ocultar' : 'Ver'} cupons disponíveis
              </Text>
              <MaterialCommunityIcons 
                name={mostrarCupons ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={Colors.primary} 
              />
            </TouchableOpacity>

            {mostrarCupons && (
              <View style={styles.cuponsList}>
                {cuponsDisponiveis.map((cupom, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.cupomItem}
                    onPress={() => {
                      setCupomInput(cupom.codigo);
                      setMostrarCupons(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cupomInfo}>
                      <Text style={styles.cupomCodigo}>{cupom.codigo}</Text>
                      <Text style={styles.cupomDescricao}>{cupom.descricao}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.text.secondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            </LinearGradient>
          </View>

          {/* Lista de Itens */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Itens no Carrinho</Text>
            <FlatList
              data={carrinho}
              renderItem={({ item, index }) => (
                <Animated.View
                  style={[
                    styles.itemContainer,
                    {
                      opacity: itemAnimations[index] || new Animated.Value(1),
                      transform: [{
                        translateY: (itemAnimations[index] || new Animated.Value(1)).interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        })
                      }]
                    }
                  ]}
                >
                  {renderItem({ item })}
                </Animated.View>
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Informações de Entrega */}
          <View style={styles.deliveryCard}>
            <LinearGradient
              colors={['#ffffff', '#f0f9ff']}
              style={styles.deliveryGradient}
            >
              <View style={styles.deliveryHeader}>
                <MaterialCommunityIcons name="truck-delivery" size={24} color={Colors.primary} />
                <Text style={styles.deliveryTitle}>Informações de Entrega</Text>
              </View>
              <View style={styles.deliveryInfo}>
                <View style={styles.deliveryItem}>
                  <MaterialCommunityIcons name="map-marker" size={18} color={Colors.text.secondary} />
                  <Text style={styles.deliveryText}>São Paulo, SP - 01234-567</Text>
                </View>
                <View style={styles.deliveryItem}>
                  <MaterialCommunityIcons name="clock-outline" size={18} color={Colors.text.secondary} />
                  <Text style={styles.deliveryText}>Entrega em 3-5 dias úteis</Text>
                </View>
                <View style={styles.deliveryItem}>
                  <MaterialCommunityIcons name="shield-check" size={18} color={Colors.text.secondary} />
                  <Text style={styles.deliveryText}>Compra protegida</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      )}

      {/* Botão de Finalizar Compra */}
      {carrinho.length > 0 && (
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.checkoutContainer}
        >
          <View style={styles.checkoutInfo}>
            <Text style={styles.checkoutTotal}>Total: R$ {calcularTotal().toFixed(2)}</Text>
            <Text style={styles.checkoutItems}>
              {carrinho.reduce((total, item) => total + item.quantidade, 0)} itens
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton} 
            onPress={finalizarCompra}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="credit-card" size={22} color={Colors.text.inverse} />
            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  headerContainer: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.lg,
  },
  continueShoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.medium,
  },
  continueShoppingText: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    fontFamily: Typography.fontFamily,
    letterSpacing: 0.3,
  },
  summaryCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: Spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  summaryTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.medium,
  },
  summaryValue: {
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.semibold,
  },
  discountValue: {
    color: Colors.primary,
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  totalValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    fontFamily: Typography.fontFamily,
  },
  cupomCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  cupomGradient: {
    padding: Spacing.lg,
  },
  cupomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  cupomTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  cupomInputContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  cupomInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fontFamily,
    color: Colors.text.primary,
    backgroundColor: Colors.surface,
  },
  cupomButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    ...Shadows.light,
  },
  cupomButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    fontFamily: Typography.fontFamily,
  },
  cupomAplicado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  cupomAplicadoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cupomAplicadoText: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.semibold,
  },
  cuponsDisponiveisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  cuponsDisponiveisText: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.weights.semibold,
  },
  cuponsList: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.md,
  },
  cupomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.xs,
  },
  cupomInfo: {
    flex: 1,
  },
  cupomCodigo: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  cupomDescricao: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xs,
  },
  itemsSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginBottom: Spacing.md,
  },
  itemContainer: {
    marginBottom: Spacing.sm,
  },
  cartItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  itemInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: Spacing.md,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
  },
  itemCategoria: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
    fontFamily: Typography.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: Typography.weights.medium,
  },
  itemNome: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  itemSpecs: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  specText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  quantityButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    ...Shadows.light,
  },
  quantityText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginHorizontal: Spacing.lg,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.tertiary,
    textDecorationLine: 'line-through',
    fontFamily: Typography.fontFamily,
  },
  currentPrice: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    fontFamily: Typography.fontFamily,
  },
  totalPrice: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xs,
  },
  deliveryCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: 100,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  deliveryGradient: {
    padding: Spacing.lg,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  deliveryTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  deliveryInfo: {
    gap: Spacing.sm,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  deliveryText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    ...Shadows.medium,
  },
  checkoutInfo: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  checkoutTotal: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  checkoutItems: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.medium,
  },
  checkoutButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    fontFamily: Typography.fontFamily,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: drawerWidth,
    backgroundColor: Colors.surface,
    zIndex: 10,
    ...Shadows.medium,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 9,
  },
  drawerContent: {
    marginTop: 100,
    paddingHorizontal: Spacing.xl,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  drawerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
  },
  drawerUserInfo: {
    flex: 1,
  },
  drawerUserName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
  drawerUserEmail: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily,
    marginTop: Spacing.xs,
  },
  drawerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.lg,
    fontFamily: Typography.fontFamily,
  },
  drawerSectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.md,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  drawerItemText: {
    marginLeft: Spacing.lg,
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily,
  },
});
