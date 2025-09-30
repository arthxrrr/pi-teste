# EcoBrick - App de E-commerce Sustentável

Um aplicativo React Native moderno para venda de tijolos ecológicos e produtos sustentáveis, desenvolvido com Expo e TypeScript.

## 🚀 Funcionalidades

### ✨ Principais Recursos
- **Catálogo de Produtos**: Tijolos ecológicos, vasos decorativos e produtos sustentáveis
- **Carrinho de Compras**: Sistema completo com cupons de desconto e cálculo de frete
- **Sistema de Favoritos**: Salve produtos para comprar depois
- **Perfil do Usuário**: Gerenciamento de dados pessoais e histórico de pedidos
- **Busca e Filtros**: Encontre produtos rapidamente com filtros avançados
- **Design Responsivo**: Interface moderna e intuitiva

### 🎨 Design System
- **Cores Consistentes**: Paleta de cores baseada em sustentabilidade
- **Tipografia**: Fonte SpaceMono para melhor legibilidade
- **Componentes Reutilizáveis**: Sistema de design modular
- **Animações Suaves**: Transições e micro-interações
- **Tema Escuro/Claro**: Suporte a múltiplos temas

### 🛠️ Tecnologias Utilizadas
- **React Native** com **Expo**
- **TypeScript** para type safety
- **Expo Router** para navegação
- **React Native Reanimated** para animações
- **Expo Linear Gradient** para gradientes
- **AsyncStorage** para persistência local
- **FontAwesome** para ícones

## 📱 Telas do App

### 🏠 Tela Inicial
- Carrossel de banners promocionais
- Categorias de produtos em destaque
- Produtos em promoção
- Seção "Por que escolher a gente?"
- Produtos recomendados
- Informações de contato

### 🛍️ Catálogo de Produtos
- Lista de produtos com filtros
- Busca por nome e descrição
- Filtros por categoria
- Ordenação por preço, avaliação e nome
- Cards de produtos com avaliações
- Sistema de favoritos

### 🛒 Carrinho de Compras
- Lista de itens selecionados
- Controle de quantidade
- Aplicação de cupons de desconto
- Cálculo automático de frete
- Resumo do pedido
- Finalização da compra

### 👤 Perfil do Usuário
- Informações pessoais editáveis
- Estatísticas de compras
- Lista de favoritos
- Histórico de pedidos
- Configurações da conta

### ℹ️ Sobre Nós
- Apresentação da empresa
- Missão e valores
- Equipe de desenvolvimento
- Estatísticas da empresa
- Informações de contato

## 🏗️ Estrutura do Projeto

```
projetointegrador-main/
├── app/                    # Telas do app (Expo Router)
│   ├── (tabs)/            # Telas com navegação por abas
│   │   ├── index.tsx      # Tela inicial
│   │   ├── produto.tsx    # Catálogo de produtos
│   │   ├── carrinho.tsx   # Carrinho de compras
│   │   ├── perfil.tsx     # Perfil do usuário
│   │   └── sobre.tsx      # Sobre a empresa
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizáveis
│   ├── Header.tsx         # Cabeçalho padrão
│   ├── Drawer.tsx         # Menu lateral
│   ├── SearchBar.tsx      # Barra de busca
│   ├── ProductCard.tsx    # Card de produto
│   ├── Button.tsx         # Botão personalizado
│   ├── Card.tsx           # Card genérico
│   ├── Input.tsx          # Input personalizado
│   └── Loading.tsx        # Componente de loading
├── constants/             # Constantes e configurações
│   ├── Theme.ts           # Sistema de design
│   ├── Config.ts          # Configurações do app
│   └── Colors.ts          # Paleta de cores
├── hooks/                 # Hooks personalizados
│   ├── useCart.ts         # Gerenciamento do carrinho
│   ├── useFavorites.ts    # Gerenciamento de favoritos
│   └── useColorScheme.ts  # Gerenciamento de tema
└── assets/                # Recursos estáticos
    ├── images/            # Imagens dos produtos
    └── fonts/             # Fontes personalizadas
```

## 🎯 Melhorias Implementadas

### 🔧 Refatoração e Organização
- **Componentes Reutilizáveis**: Criação de componentes modulares e reutilizáveis
- **Sistema de Design**: Implementação de um design system consistente
- **Hooks Personalizados**: Lógica de negócio separada em hooks customizados
- **TypeScript**: Tipagem forte para melhor manutenibilidade
- **Estrutura de Pastas**: Organização clara e escalável

### 🎨 Interface e UX
- **Design Moderno**: Interface atualizada com Material Design
- **Animações Suaves**: Transições e micro-interações
- **Responsividade**: Adaptação para diferentes tamanhos de tela
- **Acessibilidade**: Melhor suporte para usuários com necessidades especiais
- **Feedback Visual**: Indicadores de loading e estados

### ⚡ Performance
- **Lazy Loading**: Carregamento otimizado de componentes
- **Memoização**: Otimização de re-renderizações
- **AsyncStorage**: Persistência local eficiente
- **Imagens Otimizadas**: Carregamento otimizado de imagens

### 🛡️ Qualidade de Código
- **ESLint**: Linting automático para qualidade de código
- **TypeScript**: Verificação de tipos em tempo de compilação
- **Componentes Testáveis**: Estrutura preparada para testes
- **Documentação**: Código bem documentado e comentado

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Dispositivo móvel com Expo Go ou emulador

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Navegue para o diretório
cd projetointegrador-main

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start

# Para Android
npm run android

# Para iOS
npm run ios

# Para Web
npm run web
```

### Scripts Disponíveis
- `npm start` - Inicia o servidor de desenvolvimento
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS
- `npm run web` - Executa no navegador
- `npm run lint` - Executa o linter

## 📱 Funcionalidades por Tela

### Tela Inicial
- ✅ Carrossel de banners com autoplay
- ✅ Categorias de produtos
- ✅ Produtos em destaque
- ✅ Ofertas especiais
- ✅ Informações da empresa
- ✅ Produtos recomendados

### Catálogo de Produtos
- ✅ Lista de produtos com paginação
- ✅ Busca por texto
- ✅ Filtros por categoria
- ✅ Ordenação (nome, preço, avaliação)
- ✅ Cards de produtos com avaliações
- ✅ Sistema de favoritos

### Carrinho de Compras
- ✅ Lista de itens selecionados
- ✅ Controle de quantidade
- ✅ Aplicação de cupons
- ✅ Cálculo de frete
- ✅ Resumo do pedido
- ✅ Finalização da compra

### Perfil do Usuário
- ✅ Informações pessoais
- ✅ Estatísticas de compras
- ✅ Lista de favoritos
- ✅ Histórico de pedidos
- ✅ Configurações

### Sobre Nós
- ✅ Apresentação da empresa
- ✅ Missão e valores
- ✅ Equipe de desenvolvimento
- ✅ Estatísticas
- ✅ Informações de contato

## 🎨 Sistema de Design

### Cores
- **Primária**: #f59e42 (Laranja sustentável)
- **Secundária**: #10b981 (Verde ecológico)
- **Acento**: #ef4444 (Vermelho para alertas)
- **Fundo**: #f8fafc (Cinza claro)
- **Superfície**: #ffffff (Branco)

### Tipografia
- **Fonte**: SpaceMono
- **Tamanhos**: xs (10px) até xxxxl (32px)
- **Pesos**: normal, medium, semibold, bold

### Espaçamento
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **xxl**: 24px
- **xxxl**: 32px

## 🔮 Próximas Funcionalidades

### Funcionalidades Planejadas
- [ ] Sistema de avaliações de produtos
- [ ] Chat de suporte ao cliente
- [ ] Notificações push
- [ ] Integração com pagamentos
- [ ] Sistema de rastreamento de pedidos
- [ ] Programa de fidelidade
- [ ] Modo offline
- [ ] Testes automatizados

### Melhorias Técnicas
- [ ] Implementação de testes unitários
- [ ] Integração com CI/CD
- [ ] Otimização de performance
- [ ] Implementação de cache
- [ ] Monitoramento de erros
- [ ] Analytics de uso

## 👥 Equipe de Desenvolvimento

- **Alano Filho** - CEO & Fundador
- **Luiz Vieira** - CTO & Desenvolvedor
- **Arthur Rech** - COO & Designer

## 📄 Licença

Este projeto é propriedade da EcoBrick e está protegido por direitos autorais.

## 📞 Contato

- **Telefone**: (47) 9 1276-3398
- **Email**: contato@ecobrick.com.br
- **WhatsApp**: (47) 9 1276-3398
- **Endereço**: São Paulo, SP - Brasil

---

**EcoBrick** - Construindo um futuro sustentável 🌱