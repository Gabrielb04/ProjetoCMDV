# 📘 Guia de Uso dos Hooks Customizados

Este guia explica como usar os 4 hooks customizados criados no projeto.

---

## 📚 Índice

1. [useAuth](#1-useauth) - Autenticação
2. [useVehicles](#2-usevehicles) - Gerenciamento de Veículos
3. [useMaintenance](#3-usemaintenance) - Manutenções
4. [useNavigation](#4-usenavigation) - Navegação

---

## 1. useAuth

**Localização:** `/src/features/auth/hooks/useAuth.ts`

### Propósito
Gerencia toda a lógica de autenticação do aplicativo.

### Importação
```typescript
import { useAuth } from '@/features/auth';
```

### Retorno
```typescript
{
  currentUser: User | null;              // Usuário atual logado
  authScreen: 'login' | 'register';      // Tela de auth ativa
  handleLogin: (user: User) => void;     // Fazer login
  handleRegister: (user: User) => void;  // Registrar novo usuário
  handleLogout: () => void;              // Fazer logout
  switchAuthScreen: (screen) => void;    // Trocar entre login/registro
  isAuthenticated: boolean;              // Se há usuário logado
}
```

### Exemplo de Uso
```typescript
function App() {
  const auth = useAuth();

  // Verificar se está autenticado
  if (!auth.isAuthenticated) {
    if (auth.authScreen === 'login') {
      return (
        <Login
          onLogin={auth.handleLogin}
          onSwitchToRegister={() => auth.switchAuthScreen('register')}
        />
      );
    } else {
      return (
        <Register
          onRegister={auth.handleRegister}
          onSwitchToLogin={() => auth.switchAuthScreen('login')}
        />
      );
    }
  }

  // Usuário autenticado
  return (
    <div>
      <p>Bem-vindo, {auth.currentUser?.name}!</p>
      <button onClick={auth.handleLogout}>Sair</button>
    </div>
  );
}
```

### Dados Persistidos
- ✅ Usuário atual salvo em `localStorage` como `currentUser`
- ✅ Lista de usuários em `localStorage` como `users`
- ✅ Data de login em `localStorage` como `loginDate`

---

## 2. useVehicles

**Localização:** `/src/features/vehicles/hooks/useVehicles.ts`

### Propósito
Gerencia CRUD de veículos, seleção e atualização de quilometragem.

### Importação
```typescript
import { useVehicles } from '@/features/vehicles';
```

### Parâmetros
```typescript
userId: string | null  // ID do usuário atual
```

### Retorno
```typescript
{
  vehicles: Vehicle[];                    // Lista de veículos
  selectedVehicle: Vehicle | undefined;   // Veículo selecionado
  selectedVehicleId: string | null;       // ID do veículo selecionado
  handleVehicleRegistration: (data) => Vehicle | null;  // Cadastrar veículo
  handleVehicleSelection: (id) => void;   // Selecionar veículo
  handleVehicleDelete: (id) => boolean;   // Deletar veículo
  handleKmUpdate: (id, km) => void;       // Atualizar km
  checkFirstAccess: (id) => boolean;      // Verificar primeiro acesso
  shouldShowKmUpdate: (id) => boolean;    // Se deve mostrar modal km
  hasVehicles: boolean;                   // Se tem veículos cadastrados
}
```

### Exemplo de Uso
```typescript
function App() {
  const auth = useAuth();
  const vehicles = useVehicles(auth.currentUser?.id || null);

  // Cadastrar novo veículo
  const handleRegister = (data) => {
    const newVehicle = vehicles.handleVehicleRegistration(data);
    if (newVehicle) {
      vehicles.handleVehicleSelection(newVehicle.id);
      console.log('Veículo cadastrado:', newVehicle);
    }
  };

  // Atualizar quilometragem
  const handleKmUpdate = (newKm: number) => {
    if (vehicles.selectedVehicle) {
      vehicles.handleKmUpdate(vehicles.selectedVehicle.id, newKm);
    }
  };

  // Deletar veículo
  const handleDelete = (id: string) => {
    const noVehiclesLeft = vehicles.handleVehicleDelete(id);
    if (noVehiclesLeft) {
      console.log('Último veículo foi deletado');
    }
  };

  return (
    <div>
      <h1>Meus Veículos ({vehicles.vehicles.length})</h1>
      {vehicles.selectedVehicle && (
        <p>Selecionado: {vehicles.selectedVehicle.brand} {vehicles.selectedVehicle.model}</p>
      )}
    </div>
  );
}
```

### Dados Persistidos
- ✅ Veículos salvos em `localStorage` como `vehicles_{userId}`
- ✅ Veículo selecionado em `localStorage` como `selectedVehicleId_{userId}`
- ✅ Último update de km em `localStorage` como `lastKmUpdate_{userId}_{vehicleId}`
- ✅ Flag de primeiro acesso em `localStorage` como `firstAccess_{userId}_{vehicleId}`

---

## 3. useMaintenance

**Localização:** `/src/features/maintenance/hooks/useMaintenance.ts`

### Propósito
Gerencia itens de manutenção, histórico e cálculo de status.

### Importação
```typescript
import { useMaintenance } from '@/features/maintenance';
```

### Parâmetros
```typescript
userId: string | null       // ID do usuário
vehicleId: string | null    // ID do veículo selecionado
```

### Retorno
```typescript
{
  maintenanceItems: MaintenanceItem[];      // Itens no painel
  maintenanceHistory: MaintenanceRecord[];  // Histórico completo
  loadVehicleData: (id, km) => void;        // Carregar dados
  saveVehicleData: (id, items?, history?) => void;  // Salvar dados
  updateMaintenanceStatuses: (km) => void;  // Atualizar status por km
  handleAddMaintenanceItem: (data, km) => { updatedItems, updatedHistory };
  handleRecordMaintenance: (data, km) => { updatedItems, updatedHistory };
  handleRemoveMaintenanceItems: (ids) => MaintenanceItem[];
  handleRemoveHistoryRecords: (ids) => MaintenanceRecord[];
  calculateMaintenanceStatus: (item, km) => MaintenanceItem;
}
```

### Exemplo de Uso
```typescript
function App() {
  const auth = useAuth();
  const vehicles = useVehicles(auth.currentUser?.id || null);
  const maintenance = useMaintenance(
    auth.currentUser?.id || null,
    vehicles.selectedVehicleId
  );

  // Carregar dados quando veículo é selecionado
  useEffect(() => {
    if (vehicles.selectedVehicleId && vehicles.selectedVehicle) {
      maintenance.loadVehicleData(
        vehicles.selectedVehicleId,
        vehicles.selectedVehicle.currentKm
      );
    }
  }, [vehicles.selectedVehicleId]);

  // Adicionar novo item de manutenção
  const handleAddItem = (itemData) => {
    const currentKm = vehicles.selectedVehicle?.currentKm || 0;
    const { updatedItems, updatedHistory } = maintenance.handleAddMaintenanceItem(
      itemData,
      currentKm
    );

    // Salvar dados
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(
        vehicles.selectedVehicleId,
        updatedItems,
        updatedHistory
      );
    }
  };

  // Registrar manutenção realizada
  const handleRecordMaintenance = (recordData) => {
    const currentKm = vehicles.selectedVehicle?.currentKm || recordData.km;
    const { updatedItems, updatedHistory } = maintenance.handleRecordMaintenance(
      recordData,
      currentKm
    );

    // Salvar dados
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(
        vehicles.selectedVehicleId,
        updatedItems,
        updatedHistory
      );
    }
  };

  // Atualizar status quando km mudar
  const handleKmUpdate = (newKm: number) => {
    vehicles.handleKmUpdate(vehicles.selectedVehicle!.id, newKm);
    maintenance.updateMaintenanceStatuses(newKm);
  };

  return (
    <div>
      <h1>Manutenções ({maintenance.maintenanceItems.length})</h1>
      {maintenance.maintenanceItems.map(item => (
        <div key={item.id}>
          <p>{item.name} - Status: {item.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### Dados Persistidos
- ✅ Itens salvos em `localStorage` como `maintenanceItems_{userId}_{vehicleId}`
- ✅ Histórico em `localStorage` como `maintenanceHistory_{userId}_{vehicleId}`

### Cálculo de Status
O hook calcula automaticamente o status baseado em:
- **Quilometragem:** `progress = (km_atual - km_base) / alerta_km`
  - `ok`: progress < 0.8 (< 80%)
  - `warning`: 0.8 ≤ progress < 1.0 (80-99%)
  - `overdue`: progress ≥ 1.0 (≥ 100%)

- **Data:** Baseado em dias até a data de alerta
  - `ok`: faltam mais de 7 dias
  - `date-warning`: faltam 7 dias ou menos
  - `date-overdue`: data já passou

---

## 4. useNavigation

**Localização:** `/src/hooks/useNavigation.ts`

### Propósito
Controla navegação entre telas e modais.

### Importação
```typescript
import { useNavigation } from '@/hooks';
```

### Retorno
```typescript
{
  currentScreen: Screen;           // Tela atual
  showKmUpdate: boolean;           // Se modal km está aberto
  navigateTo: (screen) => void;    // Navegar para tela
  goToDashboard: () => void;       // Ir para dashboard
  goToVehicleSelection: () => void;  // Ir para seleção de veículos
  goToRegistration: () => void;    // Ir para cadastro
  goToAddItem: () => void;         // Ir para adicionar item
  goToRecordMaintenance: () => void;  // Ir para registrar manutenção
  goToHistory: () => void;         // Ir para histórico
  goToUpdateKm: () => void;        // Ir para atualizar km
  openKmUpdate: () => void;        // Abrir modal km
  closeKmUpdate: () => void;       // Fechar modal km
}
```

### Type Screen
```typescript
type Screen = 
  | 'vehicle-selection' 
  | 'registration' 
  | 'dashboard' 
  | 'add-item' 
  | 'record-maintenance' 
  | 'history' 
  | 'update-km';
```

### Exemplo de Uso
```typescript
function App() {
  const navigation = useNavigation();

  // Navegar programaticamente
  const handleVehicleRegistered = () => {
    navigation.goToDashboard();
  };

  // Mostrar modal de atualização de km
  const handleSelectVehicle = () => {
    navigation.goToDashboard();
    navigation.openKmUpdate();
  };

  // Renderização baseada em tela atual
  switch (navigation.currentScreen) {
    case 'vehicle-selection':
      return <VehicleSelection onAddVehicle={navigation.goToRegistration} />;
    
    case 'registration':
      return (
        <VehicleRegistration
          onRegister={handleVehicleRegistered}
          onBack={navigation.goToVehicleSelection}
        />
      );
    
    case 'dashboard':
      return (
        <>
          <Dashboard
            onAddItem={navigation.goToAddItem}
            onRecordMaintenance={navigation.goToRecordMaintenance}
            onViewHistory={navigation.goToHistory}
          />
          {navigation.showKmUpdate && (
            <KilometrageUpdateModal onClose={navigation.closeKmUpdate} />
          )}
        </>
      );
    
    case 'add-item':
      return <MaintenanceForm onBack={navigation.goToDashboard} />;
    
    case 'record-maintenance':
      return <MaintenanceRecord onBack={navigation.goToDashboard} />;
    
    case 'history':
      return <MaintenanceHistory onBack={navigation.goToDashboard} />;
    
    case 'update-km':
      return <KilometrageUpdate onBack={navigation.goToDashboard} />;
    
    default:
      return null;
  }
}
```

---

## 🎯 Exemplo Completo: App.tsx

```typescript
import { useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { useVehicles } from '@/features/vehicles';
import { useMaintenance } from '@/features/maintenance';
import { useNavigation } from '@/hooks';

export default function App() {
  // 1. Setup dos hooks
  const auth = useAuth();
  const vehicles = useVehicles(auth.currentUser?.id || null);
  const maintenance = useMaintenance(
    auth.currentUser?.id || null,
    vehicles.selectedVehicleId
  );
  const navigation = useNavigation();

  // 2. Carregar dados quando veículo selecionado
  useEffect(() => {
    if (vehicles.selectedVehicleId && vehicles.selectedVehicle) {
      maintenance.loadVehicleData(
        vehicles.selectedVehicleId,
        vehicles.selectedVehicle.currentKm
      );
    }
  }, [vehicles.selectedVehicleId]);

  // 3. Determinar tela inicial
  useEffect(() => {
    if (!auth.currentUser) return;

    if (!vehicles.hasVehicles) {
      navigation.navigateTo('registration');
    } else if (!vehicles.selectedVehicleId) {
      navigation.navigateTo('vehicle-selection');
    }
  }, [auth.currentUser, vehicles.hasVehicles, vehicles.selectedVehicleId]);

  // 4. Handlers que orquestram os hooks
  const handleVehicleRegistration = (data: any) => {
    const newVehicle = vehicles.handleVehicleRegistration(data);
    if (newVehicle) {
      vehicles.handleVehicleSelection(newVehicle.id);
      maintenance.loadVehicleData(newVehicle.id, newVehicle.currentKm);
      navigation.goToDashboard();
    }
  };

  const handleAddMaintenanceItem = (itemData: any) => {
    const currentKm = vehicles.selectedVehicle?.currentKm || 0;
    const { updatedItems, updatedHistory } = maintenance.handleAddMaintenanceItem(
      itemData,
      currentKm
    );

    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(
        vehicles.selectedVehicleId,
        updatedItems,
        updatedHistory
      );
    }

    navigation.goToDashboard();
  };

  const handleLogout = () => {
    if (vehicles.selectedVehicleId) {
      maintenance.saveVehicleData(vehicles.selectedVehicleId);
    }
    auth.handleLogout();
    navigation.goToVehicleSelection();
  };

  // 5. Renderização condicional
  if (!auth.isAuthenticated) {
    return auth.authScreen === 'login' ? (
      <Login
        onLogin={auth.handleLogin}
        onSwitchToRegister={() => auth.switchAuthScreen('register')}
      />
    ) : (
      <Register
        onRegister={(user) => {
          auth.handleRegister(user);
          navigation.goToRegistration();
        }}
        onSwitchToLogin={() => auth.switchAuthScreen('login')}
      />
    );
  }

  // Renderização baseada na tela atual
  switch (navigation.currentScreen) {
    case 'vehicle-selection':
      return (
        <VehicleSelection
          vehicles={vehicles.vehicles}
          onSelectVehicle={(id) => {
            vehicles.handleVehicleSelection(id);
            navigation.goToDashboard();
            if (!vehicles.checkFirstAccess(id)) {
              navigation.openKmUpdate();
            }
          }}
          onAddVehicle={navigation.goToRegistration}
          onDeleteVehicle={vehicles.handleVehicleDelete}
          onLogout={handleLogout}
        />
      );

    case 'registration':
      return (
        <VehicleRegistration
          onRegister={handleVehicleRegistration}
          onBack={vehicles.hasVehicles ? navigation.goToVehicleSelection : undefined}
          onLogout={handleLogout}
        />
      );

    case 'dashboard':
      return (
        <>
          <Dashboard
            vehicle={vehicles.selectedVehicle!}
            maintenanceItems={maintenance.maintenanceItems}
            onNavigate={navigation.navigateTo}
            onBackToVehicles={navigation.goToVehicleSelection}
            onRemoveItems={maintenance.handleRemoveMaintenanceItems}
          />
          {navigation.showKmUpdate && (
            <KilometrageUpdate
              vehicle={vehicles.selectedVehicle!}
              onUpdate={(newKm) => {
                vehicles.handleKmUpdate(vehicles.selectedVehicle!.id, newKm);
                maintenance.updateMaintenanceStatuses(newKm);
                navigation.closeKmUpdate();
              }}
              onSkip={navigation.closeKmUpdate}
            />
          )}
        </>
      );

    case 'add-item':
      return (
        <MaintenanceForm
          vehicle={vehicles.selectedVehicle!}
          onSubmit={handleAddMaintenanceItem}
          onBack={navigation.goToDashboard}
        />
      );

    // ... outras telas

    default:
      return null;
  }
}
```

---

## 💡 Boas Práticas

### ✅ DO
- ✅ **Sempre passe o userId** para hooks que precisam (useVehicles, useMaintenance)
- ✅ **Salve dados** após operações importantes
- ✅ **Carregue dados** quando necessário (useEffect)
- ✅ **Use os handlers** fornecidos pelos hooks
- ✅ **Verifique nullish** antes de usar dados (`vehicles.selectedVehicle?.`)

### ❌ DON'T
- ❌ **Não modifique** estados dos hooks diretamente
- ❌ **Não esqueça** de salvar dados após mudanças
- ❌ **Não acesse** localStorage diretamente (use os hooks)
- ❌ **Não duplique** lógica que já está nos hooks

---

## 🔧 Troubleshooting

### Problema: Dados não são persistidos
**Solução:** Verifique se está chamando `saveVehicleData` após modificações:
```typescript
const { updatedItems, updatedHistory } = maintenance.handleAddMaintenanceItem(...);
maintenance.saveVehicleData(vehicleId, updatedItems, updatedHistory);
```

### Problema: Status não atualiza
**Solução:** Chame `updateMaintenanceStatuses` após atualizar km:
```typescript
vehicles.handleKmUpdate(vehicleId, newKm);
maintenance.updateMaintenanceStatuses(newKm);
```

### Problema: Dados de outro usuário aparecem
**Solução:** Sempre passe o `userId` correto:
```typescript
const vehicles = useVehicles(auth.currentUser?.id || null);
const maintenance = useMaintenance(auth.currentUser?.id || null, vehicleId);
```

---

## 📚 Recursos Adicionais

- **Documentação completa:** `/docs/ARCHITECTURE.md`
- **Checklist de testes:** `/docs/TESTING_CHECKLIST.md`
- **Status do projeto:** `/docs/PROJECT_STATUS.md`

---

**Desenvolvido com ❤️ para o Projeto Acadêmico da Faculdade Senac Ceará**
