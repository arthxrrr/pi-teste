export const AppConfig = {
  name: 'EcoBrick',
  version: '1.0.0',
  description: 'Construindo um futuro sustentável',
  
  // URLs e APIs
  api: {
    baseUrl: 'https://api.ecobrick.com.br',
    timeout: 10000,
  },
  
  // Configurações de navegação
  navigation: {
    drawerWidth: 0.7, // 70% da largura da tela
    animationDuration: 250,
  },
  
  // Configurações de produtos
  products: {
    itemsPerPage: 20,
    maxFavorites: 50,
    maxCartItems: 99,
  },
  
  // Configurações de carrinho
  cart: {
    freeShippingThreshold: 50,
    defaultShippingCost: 15,
    maxQuantity: 99,
  },
  
  // Configurações de cupons
  coupons: {
    maxUsagePerUser: 3,
    expirationDays: 30,
  },
  
  // Configurações de notificações
  notifications: {
    orderUpdates: true,
    promotions: true,
    newProducts: true,
  },
  
  // Configurações de contato
  contact: {
    phone: '(47) 9 1276-3398',
    email: 'contato@ecobrick.com.br',
    whatsapp: '(47) 9 1276-3398',
    address: 'São Paulo, SP - Brasil',
  },
  
  // Configurações de redes sociais
  social: {
    instagram: '@ecobrick',
    facebook: 'EcoBrick',
    twitter: '@ecobrick',
  },
  
  // Configurações de pagamento
  payment: {
    methods: ['credit_card', 'debit_card', 'pix', 'boleto'],
    installments: {
      min: 1,
      max: 12,
    },
  },
  
  // Configurações de entrega
  delivery: {
    estimatedDays: '3-5',
    trackingEnabled: true,
    insuranceIncluded: true,
  },
};
