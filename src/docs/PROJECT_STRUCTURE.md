# 🗂️ Estrutura do Projeto - CMDV

## Visão Geral Completa

```
CMDV/
│
├── 📄 App.tsx                          # Componente raiz (~130 linhas)
├── 📄 index.html                       # HTML principal
├── 📄 vite.config.ts                   # Configuração Vite
├── 📄 tsconfig.json                    # Configuração TypeScript
├── 📄 .env.example                     # Template de variáveis
├── 📄 README.md                        # Documentação principal
├── 📄 CHANGELOG.md                     # Histórico de mudanças
│
├── 📁 src/                             # Código fonte
│   ├── 📄 main.tsx                    # Entry point
│   │
│   ├── 📁 features/                   # Features organizadas por domínio
│   │   │
│   │   ├── 📁 auth/                   # 🔐 Autenticação
│   │   │   ├── 📁 components/
│   │   │   │   ├── Login.tsx         # Tela de login
│   │   │   │   └── Register.tsx      # Tela de registro
│   │   │   ├── 📁 hooks/
│   │   │   │   └── useAuth.ts        # Hook de autenticação
│   │   │   └── 📄 index.ts           # Barrel export
│   │   │
│   │   ├── 📁 vehicles/               # 🚗 Veículos
│   │   │   ├── 📁 components/
│   │   │   │   ├── VehicleSelection.tsx      # Seleção de veículo
│   │   │   │   ├── VehicleRegistration.tsx   # Cadastro de veículo
│   │   │   │   └── KilometrageUpdate.tsx     # Atualização de KM
│   │   │   ├── 📁 hooks/
│   │   │   │   └── useVehicles.ts    # Hook de veículos
│   │   │   └── 📄 index.ts           # Barrel export
│   │   │
│   │   ├── 📁 dashboard/              # 📊 Dashboard
│   │   │   ├── 📁 components/
│   │   │   │   └── Dashboard.tsx     # Dashboard principal
│   │   │   └── 📄 index.ts           # Barrel export
│   │   │
│   │   └── 📁 maintenance/            # 🔧 Manutenção
│   │       ├── 📁 components/
│   │       │   ├── MaintenanceForm.tsx     # Adicionar item
│   │       │   ├── MaintenanceRecord.tsx   # Registrar manutenção
│   │       │   └── MaintenanceHistory.tsx  # Histórico
│   │       ├── 📁 hooks/
│   │       │   └── useMaintenance.ts # Hook de manutenção
│   │       └── 📄 index.ts           # Barrel export
│   │
│   ├── 📁 hooks/                      # 🎣 Hooks globais
│   │   ├── useNavigation.ts          # Navegação entre telas
│   │   ├── useAppHandlers.ts         # Handlers centralizados
│   │   ├── useAppEffects.ts          # Efeitos colaterais
│   │   └── index.ts                  # Barrel export
│   │
│   ├── 📁 components/                 # 🧩 Componentes
│   │   ├── 📁 ui/                    # shadcn/ui (40+ componentes)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   └── 📁 shared/                # Componentes compartilhados
│   │       ├── ThemeToggle.tsx       # Toggle de tema
│   │       └── index.ts
│   │
│   ├── 📁 types/                      # 📘 TypeScript Types
│   │   ├── auth.ts                   # Tipos de autenticação
│   │   ├── vehicle.ts                # Tipos de veículo
│   │   ├── maintenance.ts            # Tipos de manutenção
│   │   └── index.ts                  # Barrel export
│   │
│   └── 📁 utils/                      # 🛠️ Utilitários
│       ├── date.ts                   # Funções de data
│       ├── validation.ts             # Validações
│       └── index.ts                  # Barrel export
│
├── 📁 components/                     # Componentes base
│   ├── 📁 ui/                        # shadcn/ui components
│   │   └── ... (40+ arquivos)
│   └── 📁 figma/
│       └── ImageWithFallback.tsx     # Componente protegido
│
├── 📁 styles/                         # 🎨 Estilos
│   └── globals.css                   # CSS global (Tailwind v4)
│
├── 📁 docs/                           # 📚 Documentação
│   ├── ARCHITECTURE.md               # Arquitetura detalhada
│   ├── QUICK_START.md                # Guia rápido
│   ├── HOOKS_USAGE_GUIDE.md          # Guia de hooks
│   ├── CONTRIBUTING.md               # Como contribuir
│   ├── TESTING_CHECKLIST.md          # Checklist de testes
│   ├── PROJECT_STATUS.md             # Status do projeto
│   ├── REFACTORING_COMPLETE.md       # Resumo da refatoração
│   ├── FINAL_POLISH.md               # Ajustes finais
│   ├── EXECUTIVE_SUMMARY.md          # Resumo executivo
│   ├── PROJECT_STRUCTURE.md          # Este arquivo
│   └── ...
│
├── 📁 supabase/                       # ☁️ Backend
│   └── 📁 functions/
│       └── 📁 server/
│           ├── index.tsx
│           └── kv_store.tsx
│
└── 📁 imports/                        # 📦 Arquivos importados
    └── 📁 pasted_text/
        ├── project-refactor-notes.md
        ├── migration-checklist.md
        └── projeto-finalizacao.md
```

---

## 📊 Estatísticas

### Arquivos por Tipo
```
TypeScript/TSX:  ~60 arquivos
Documentação:    ~15 arquivos
Configuração:    ~5 arquivos
CSS:             2 arquivos
HTML:            1 arquivo
Total:           ~85 arquivos
```

### Linhas de Código (aproximado)

| Categoria | Linhas | % |
|-----------|--------|---|
| Features | ~3,000 | 50% |
| Hooks | ~600 | 10% |
| Components UI | ~2,000 | 33% |
| Types | ~200 | 3% |
| Utils | ~100 | 2% |
| App.tsx | ~130 | 2% |
| **Total** | **~6,030** | **100%** |

---

## 🎯 Mapa de Responsabilidades

### App.tsx
```typescript
Responsabilidade: Orquestração
- Importar hooks
- Renderizar telas baseado em estado
- Passar props para componentes
Linhas: ~130
```

### Features
```typescript
auth/         → Login, Registro, Autenticação
vehicles/     → CRUD de veículos, Seleção, KM
dashboard/    → Visualização principal
maintenance/  → CRUD manutenções, Histórico
```

### Hooks
```typescript
useAuth          → Estado e lógica de autenticação
useVehicles      → Estado e lógica de veículos
useMaintenance   → Estado e lógica de manutenção
useNavigation    → Estado e lógica de navegação
useAppHandlers   → Event handlers centralizados
useAppEffects    → Efeitos colaterais (useEffect)
```

### Components
```typescript
/components/ui/       → Componentes shadcn/ui genéricos
/components/shared/   → Componentes compartilhados do produto
/components/figma/    → Componentes protegidos do sistema
```

### Types
```typescript
auth.ts          → User, AuthState, etc.
vehicle.ts       → Vehicle, VehicleFormData, etc.
maintenance.ts   → MaintenanceItem, MaintenanceHistory, etc.
```

### Utils
```typescript
date.ts          → formatDate, parseDate, etc.
validation.ts    → validatePlate, validateKm, etc.
```

---

## 🔗 Fluxo de Dependências

```
App.tsx
  ↓
  ├─→ Features (auth, vehicles, dashboard, maintenance)
  │     ↓
  │     ├─→ Feature Hooks (useAuth, useVehicles, useMaintenance)
  │     └─→ Feature Components
  │           ↓
  │           └─→ UI Components (shadcn/ui)
  │
  ├─→ Global Hooks (useNavigation, useAppHandlers, useAppEffects)
  │
  └─→ Types & Utils
```

---

## 📦 Barrel Exports

### Por que usar?
- Imports mais limpos
- Melhor organização
- Fácil refatoração
- Controle de API pública

### Exemplo de uso:

**Sem barrel exports:**
```typescript
import { Login } from './src/features/auth/components/Login';
import { Register } from './src/features/auth/components/Register';
import { useAuth } from './src/features/auth/hooks/useAuth';
```

**Com barrel exports:**
```typescript
import { Login, Register, useAuth } from './src/features/auth';
```

### Onde estão:
- ✅ `/src/features/auth/index.ts`
- ✅ `/src/features/vehicles/index.ts`
- ✅ `/src/features/dashboard/index.ts`
- ✅ `/src/features/maintenance/index.ts`
- ✅ `/src/hooks/index.ts`
- ✅ `/src/types/index.ts`
- ✅ `/src/utils/index.ts`
- ✅ `/src/components/shared/index.ts`

---

## 🎨 Convenções de Nomenclatura

### Arquivos
```
PascalCase:     Components (Dashboard.tsx, Login.tsx)
camelCase:      Hooks (useAuth.ts, useVehicles.ts)
camelCase:      Utils (validation.ts, date.ts)
lowercase:      Types (vehicle.ts, maintenance.ts)
kebab-case:     CSS (globals.css)
UPPERCASE:      Docs (README.md, CHANGELOG.md)
```

### Código
```typescript
// Components
export function MyComponent() { }

// Hooks
export function useMyHook() { }

// Types
export interface MyType { }
export type MyUnion = 'a' | 'b';

// Constants
export const MY_CONSTANT = 'value';

// Functions
export function myFunction() { }
```

---

## 🛣️ Rotas de Navegação

```
Navegação gerenciada por useNavigation hook

Telas disponíveis:
├─ 'login'              → Login.tsx
├─ 'register'           → Register.tsx
├─ 'vehicle-selection'  → VehicleSelection.tsx
├─ 'registration'       → VehicleRegistration.tsx
├─ 'dashboard'          → Dashboard.tsx
├─ 'add-item'          → MaintenanceForm.tsx
├─ 'record-maintenance' → MaintenanceRecord.tsx
├─ 'history'           → MaintenanceHistory.tsx
└─ 'update-km'         → KilometrageUpdate.tsx
```

---

## 💾 Armazenamento de Dados

### localStorage (Offline)
```
Chaves usadas:
├─ users                                    # Todos os usuários
├─ currentUser                             # Usuário atual
├─ vehicles_{userId}                       # Veículos do usuário
├─ selectedVehicle_{userId}                # Veículo selecionado
├─ maintenance_{userId}_{vehicleId}        # Itens de manutenção
├─ history_{userId}_{vehicleId}            # Histórico
└─ lastKmUpdate_{userId}_{vehicleId}       # Última atualização de KM
```

### Supabase (Online - Opcional)
```
Tables:
├─ users          # Autenticação
├─ vehicles       # Veículos
├─ maintenance    # Itens de manutenção
└─ history        # Histórico de manutenções
```

---

## 🔍 Como Encontrar Algo

### "Onde está a lógica de autenticação?"
→ `/src/features/auth/hooks/useAuth.ts`

### "Onde está o componente de login?"
→ `/src/features/auth/components/Login.tsx`

### "Onde está a lógica de navegação?"
→ `/src/hooks/useNavigation.ts`

### "Onde estão os handlers de eventos?"
→ `/src/hooks/useAppHandlers.ts`

### "Onde está a fórmula de alerta?"
→ `/src/features/dashboard/components/Dashboard.tsx`

### "Onde adicionar um novo tipo?"
→ `/src/types/[categoria].ts`

### "Onde adicionar uma nova validação?"
→ `/src/utils/validation.ts`

### "Onde está a documentação técnica?"
→ `/docs/`

---

## 🚀 Adicionando Nova Feature

### 1. Criar estrutura
```bash
mkdir -p src/features/nova-feature/components
mkdir -p src/features/nova-feature/hooks
touch src/features/nova-feature/index.ts
```

### 2. Criar componente
```typescript
// src/features/nova-feature/components/NovoComponente.tsx
export function NovoComponente() {
  return <div>Nova Feature</div>;
}
```

### 3. Criar hook (se necessário)
```typescript
// src/features/nova-feature/hooks/useNovaFeature.ts
export function useNovaFeature() {
  const [state, setState] = useState();
  return { state };
}
```

### 4. Barrel export
```typescript
// src/features/nova-feature/index.ts
export { NovoComponente } from './components/NovoComponente';
export { useNovaFeature } from './hooks/useNovaFeature';
```

### 5. Usar no App.tsx
```typescript
import { NovoComponente, useNovaFeature } from './src/features/nova-feature';
```

---

## 📝 Notas Importantes

### Arquivos Protegidos (Não Modificar)
- `/components/figma/ImageWithFallback.tsx`

### Arquivos Principais
- `/App.tsx` - Componente raiz
- `/src/main.tsx` - Entry point
- `/styles/globals.css` - Estilos globais

### Pastas Auto-gerenciadas
- `/components/ui/` - shadcn/ui components

---

**Última atualização**: 22 de março de 2026  
**Versão do projeto**: 2.0.0
