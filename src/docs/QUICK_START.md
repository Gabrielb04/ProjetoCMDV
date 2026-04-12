# 🚀 Guia Rápido - Carteira Digital de Manutenção Veicular

## 📋 Visão Geral

Sistema completo de gestão de manutenção veicular desenvolvido para o Senac Ceará, com suporte offline (localStorage) e online (Supabase).

## 🏗️ Arquitetura

```
/
├── App.tsx                      # Componente principal (orquestração)
├── src/
│   ├── features/                # Módulos por funcionalidade
│   │   ├── auth/               # Autenticação
│   │   ├── vehicles/           # Gestão de veículos
│   │   ├── dashboard/          # Dashboard principal
│   │   └── maintenance/        # Manutenções e peças
│   ├── hooks/                  # Hooks personalizados
│   │   ├── useAuth.ts         # Autenticação
│   │   ├── useVehicles.ts     # Veículos
│   │   ├── useMaintenance.ts  # Manutenções
│   │   ├── useNavigation.ts   # Navegação
│   │   ├── useAppHandlers.ts  # Handlers centralizados
│   │   └── useAppEffects.ts   # Efeitos colaterais
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utilitários
│   └── components/
│       ├── ui/                 # shadcn/ui components
│       └── shared/             # Componentes compartilhados
└── components/
    └── ui/                     # Componentes UI base
```

## 🎯 Hooks Principais

### 1. useAuth()
Gerencia autenticação de usuários.

```typescript
const auth = useAuth();

// Propriedades
auth.currentUser       // Usuário atual
auth.isAuthenticated   // Status de autenticação
auth.authScreen       // 'login' | 'register'

// Métodos
auth.handleLogin(email, password)
auth.handleRegister(userData)
auth.handleLogout()
auth.switchAuthScreen('login' | 'register')
```

### 2. useVehicles(userId)
Gerencia veículos do usuário.

```typescript
const vehicles = useVehicles(userId);

// Propriedades
vehicles.vehicles              // Lista de veículos
vehicles.selectedVehicleId     // ID do veículo selecionado
vehicles.selectedVehicle       // Objeto do veículo selecionado
vehicles.hasVehicles          // Boolean se tem veículos

// Métodos
vehicles.handleVehicleRegistration(data)
vehicles.handleVehicleSelection(id)
vehicles.handleVehicleDelete(id)
vehicles.handleKmUpdate(id, newKm)
vehicles.checkFirstAccess(id)
```

### 3. useMaintenance(userId, vehicleId)
Gerencia itens e histórico de manutenção.

```typescript
const maintenance = useMaintenance(userId, vehicleId);

// Propriedades
maintenance.maintenanceItems    // Itens de manutenção
maintenance.maintenanceHistory  // Histórico completo

// Métodos
maintenance.loadVehicleData(vehicleId, currentKm)
maintenance.saveVehicleData(vehicleId, items?, history?)
maintenance.handleAddMaintenanceItem(data, currentKm)
maintenance.handleRecordMaintenance(data, currentKm)
maintenance.updateMaintenanceStatuses(newKm)
maintenance.handleRemoveMaintenanceItems(ids)
maintenance.handleRemoveHistoryRecords(ids)
```

### 4. useNavigation()
Gerencia navegação entre telas.

```typescript
const navigation = useNavigation();

// Propriedades
navigation.currentScreen  // Tela atual
navigation.showKmUpdate  // Modal de atualização de KM

// Métodos
navigation.navigateTo(screen)
navigation.goToDashboard()
navigation.goToRegistration()
navigation.goToVehicleSelection()
navigation.goToAddItem()
navigation.goToRecordMaintenance()
navigation.goToHistory()
navigation.goToUpdateKm()
navigation.openKmUpdate()
navigation.closeKmUpdate()
```

### 5. useAppHandlers()
Centraliza todos os event handlers da aplicação.

```typescript
const handlers = useAppHandlers({ auth, vehicles, maintenance });

// Retorna
handlers.navigation                      // Hook de navegação
handlers.handleVehicleRegistration(data)
handlers.handleVehicleSelection(id)
handlers.handleVehicleDelete(id)
handlers.handleKmUpdate(km)
handlers.handleKmSkip()
handlers.handleAddMaintenanceItem(data)
handlers.handleRecordMaintenance(data)
handlers.handleRemoveMaintenanceItems(ids)
handlers.handleRemoveHistoryRecords(ids)
handlers.handleLogout()
```

### 6. useAppEffects()
Centraliza efeitos colaterais (metadata, sincronização).

```typescript
useAppEffects({ auth, vehicles, maintenance, navigation });
// Não retorna nada - apenas executa efeitos
```

## 📱 Fluxo de Navegação

```
Login/Register → Vehicle Selection → Dashboard
                      ↓                   ↓
                 Registration         Add Item
                                          ↓
                                   Record Maintenance
                                          ↓
                                      History
```

## 🔧 Como Adicionar uma Nova Feature

### 1. Criar estrutura de feature:

```
src/features/nova-feature/
├── components/
│   └── NovoComponente.tsx
├── hooks/
│   └── useNovaFeature.ts
├── types/
│   └── nova-feature.ts
└── index.ts
```

### 2. Criar o hook personalizado:

```typescript
// src/features/nova-feature/hooks/useNovaFeature.ts
export function useNovaFeature(userId: string | null) {
  const [state, setState] = useState(...);
  
  const handleAction = () => {
    // lógica
  };
  
  return {
    state,
    handleAction,
  };
}
```

### 3. Exportar no index.ts:

```typescript
// src/features/nova-feature/index.ts
export { NovoComponente } from './components/NovoComponente';
export { useNovaFeature } from './hooks/useNovaFeature';
```

### 4. Usar no App.tsx:

```typescript
import { NovoComponente, useNovaFeature } from './src/features/nova-feature';

const novaFeature = useNovaFeature(auth.currentUser?.id);
```

## 🎨 Sistema de Alertas

### Fórmula de Progressão
```typescript
progresso = (km_atual - km_base) / alerta_km * 100
```

### Estados Visuais
- **OK**: < 80% (verde)
- **Em Breve**: 80-99% (amarelo)
- **Vencido**: ≥ 100% (vermelho)

## 💾 Armazenamento

### localStorage (Offline)
```javascript
// Veículos
localStorage.getItem(`vehicles_${userId}`)

// Manutenções
localStorage.getItem(`maintenance_${userId}_${vehicleId}`)

// Histórico
localStorage.getItem(`history_${userId}_${vehicleId}`)
```

### Supabase (Online)
- Sincronização automática quando conectado
- Migração automática de dados locais
- Multi-dispositivo

## 📊 Dados Pré-configurados

### 10 Peças (Troca de Peças)
1. Óleo do Motor
2. Filtro de Óleo
3. Filtro de Ar
4. Filtro de Combustível
5. Velas de Ignição
6. Correia Dentada
7. Pastilhas de Freio
8. Discos de Freio
9. Pneus
10. Bateria

### 10 Serviços
1. Alinhamento e Balanceamento
2. Troca de Fluido de Freio
3. Revisão Completa
4. Ar Condicionado
5. Suspensão
6. Sistema Elétrico
7. Limpeza de Bicos Injetores
8. Troca de Amortecedores
9. Cambagem
10. Inspeção Veicular

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 📝 Convenções de Código

### Nomenclatura
- **Components**: PascalCase (`VehicleSelection.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useVehicles.ts`)
- **Types**: PascalCase (`Vehicle`, `MaintenanceItem`)
- **Utils**: camelCase (`formatDate`, `validateKm`)

### Imports
```typescript
// Relativos para features
import { Login } from './src/features/auth';

// Relativos para UI components
import { Button } from './components/ui/button';

// Relativos para hooks
import { useAuth } from './src/hooks';
```

### Estrutura de Componente
```typescript
// Imports
import { useState } from 'react';
import { Button } from './components/ui/button';

// Types
interface Props {
  onSubmit: () => void;
}

// Component
export function MeuComponente({ onSubmit }: Props) {
  // Hooks
  const [state, setState] = useState();
  
  // Handlers
  const handleClick = () => {
    // lógica
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## 🔍 Debugging

### Verificar dados salvos
```javascript
// Console do navegador
Object.keys(localStorage)
  .filter(key => key.includes('vehicles') || key.includes('maintenance'))
  .forEach(key => console.log(key, localStorage.getItem(key)));
```

### Limpar dados de teste
```javascript
// CUIDADO: Remove todos os dados
Object.keys(localStorage).forEach(key => {
  if (key.includes('vehicles') || key.includes('maintenance')) {
    localStorage.removeItem(key);
  }
});
```

## 📚 Recursos Adicionais

- [Arquitetura Completa](./ARCHITECTURE.md)
- [Guia de Contribuição](./CONTRIBUTING.md)
- [Checklist de Testes](./TESTING_CHECKLIST.md)
- [Status do Projeto](./PROJECT_STATUS.md)

---

**Desenvolvido para Faculdade Senac Ceará** 🎓
