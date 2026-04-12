# Arquitetura do CMDV

## Visão Geral

O CMDV (Carteira de Manutenção Digital de Veículos) segue uma arquitetura **mobile-first** e **offline-first**, construída com React e TypeScript.

## Princípios Arquiteturais

### 1. Separation of Concerns (SoC)
- **Features**: Código organizado por domínio de negócio
- **Types**: Definições de tipos centralizadas
- **Utils**: Funções utilitárias reutilizáveis
- **Components**: UI separada em genérica (ui/) e específica (shared/)

### 2. Domain-Driven Design (Simplificado)
```
features/
  auth/          # Domínio de Autenticação
  vehicles/      # Domínio de Veículos
  maintenance/   # Domínio de Manutenção
  dashboard/     # Domínio de Visualização
```

### 3. Component Architecture
```
Feature Component (ex: Login)
  ├─ UI Components (shadcn/ui)
  ├─ Business Logic (hooks)
  ├─ Types (interfaces)
  └─ Utils (helpers)
```

## Estrutura de Diretórios

```
src/
├── features/              # Funcionalidades por domínio
│   ├── auth/
│   │   ├── components/   # Componentes específicos de auth
│   │   ├── hooks/        # Hooks customizados de auth
│   │   ├── types.ts      # Tipos específicos (opcional)
│   │   └── index.ts      # Barrel export
│   │
│   ├── vehicles/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   ├── maintenance/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   └── dashboard/
│       ├── components/
│       └── index.ts
│
├── components/
│   ├── ui/               # shadcn/ui components (genéricos)
│   └── shared/           # Componentes compartilhados do produto
│       └── ThemeToggle.tsx
│
├── types/                # Definições de tipos globais
│   ├── auth.ts
│   ├── vehicle.ts
│   ├── maintenance.ts
│   └── index.ts
│
├── utils/                # Funções utilitárias
│   ├── date.ts          # Manipulação de datas
│   ├── validation.ts    # Validações
│   └── index.ts
│
├── services/             # Camada de serviços (futuro)
│   ├── supabase.ts
│   ├── storage.ts
│   └── api.ts
│
├── hooks/                # Hooks globais (futuro)
│   ├── useAuth.ts
│   ├── useVehicles.ts
│   └── useMaintenance.ts
│
├── styles/               # Estilos globais
│   └── globals.css
│
└── main.tsx             # Ponto de entrada
```

## Fluxo de Dados

### 1. Estado Local (useState)
Usado para:
- Estado de formulários
- UI temporária
- Flags de loading

### 2. Props Drilling (Atual)
Dados fluem de App.tsx para componentes filhos:
```
App.tsx
  ├─ currentUser
  ├─ vehicles[]
  ├─ maintenanceItems[]
  └─ maintenanceHistory[]
```

### 3. LocalStorage
Persistência offline:
```
localStorage
  ├─ users[]
  ├─ currentUser
  ├─ vehicles_<userId>[]
  ├─ maintenanceItems_<vehicleId>[]
  └─ maintenanceHistory_<vehicleId>[]
```

### 4. Supabase (Online)
Sincronização em nuvem:
```
Supabase
  ├─ Auth (usuários)
  ├─ KV Store (dados chave-valor)
  └─ Storage (arquivos futuros)
```

## Padrões de Nomenclatura

### Arquivos
- **Componentes**: PascalCase (`Login.tsx`, `Dashboard.tsx`)
- **Utilitários**: camelCase (`date.ts`, `validation.ts`)
- **Tipos**: camelCase (`auth.ts`, `vehicle.ts`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`)

### Código
```typescript
// Interfaces
interface User { ... }

// Type aliases
type Status = 'ok' | 'warning' | 'overdue';

// Funções
const calculateProgress = () => { ... }

// Componentes
export function Login() { ... }

// Hooks
export const useAuth = () => { ... }
```

## Estratégia de Imports

### Barrel Exports
Cada feature/diretório tem um `index.ts`:
```typescript
// src/features/auth/index.ts
export { Login } from './components/Login';
export { Register } from './components/Register';

// Uso
import { Login, Register } from '@/features/auth';
```

### Path Aliases (Recomendado)
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

## Sistema de Alertas

### Cálculo de Progresso
```typescript
// Progresso por KM
const kmProgress = (vehicle.currentKm - item.kmBase) / item.alertKm;

// Progresso por Data
const today = new Date();
const daysSinceLastMaintenance = differenceInDays(today, item.lastMaintenanceDate);
const daysUntilAlert = differenceInDays(item.alertDate, item.lastMaintenanceDate);
const dateProgress = daysSinceLastMaintenance / daysUntilAlert;
```

### Estados
```typescript
type Status = 
  | 'ok'              // < 80%
  | 'warning'         // 80-99% (KM)
  | 'overdue'         // >= 100% (KM)
  | 'date-warning'    // 80-99% (Data)
  | 'date-overdue'    // >= 100% (Data)
  | 'no-alert';       // Sem alerta configurado
```

## Responsividade

### Breakpoints (Tailwind)
```css
sm: 640px   /* Tablets pequenos */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

### Mobile-First Approach
```typescript
// Padrão: mobile
className="flex-col"

// Desktop: horizontal
className="flex-col lg:flex-row"
```

## Performance

### Otimizações Implementadas
1. **useMemo** para cálculos pesados
2. **Barrel exports** para tree-shaking
3. **Lazy loading** (futuro)
4. **Code splitting** por feature (futuro)

### Otimizações Futuras
- [ ] React.lazy para rotas
- [ ] Virtualização de listas longas
- [ ] Debounce em inputs de busca
- [ ] Service Worker para PWA

## Segurança

### Dados Sensíveis
- ✅ Senhas não são armazenadas em texto puro no localStorage
- ✅ Validação de entrada em todos os formulários
- ✅ Sanitização de dados antes de salvar

### Supabase
- ✅ Row Level Security (RLS) habilitado
- ✅ Service Role Key protegida no backend
- ✅ ANON Key exposta apenas para operações seguras

## Testing Strategy (Futuro)

```
tests/
  ├── unit/           # Testes unitários (utils, hooks)
  ├── integration/    # Testes de integração (features)
  └── e2e/            # Testes end-to-end (fluxos completos)
```

## CI/CD (Futuro)

```yaml
# Sugestão de pipeline
1. Lint (ESLint)
2. Type Check (TypeScript)
3. Unit Tests (Vitest)
4. Build
5. Deploy (Vercel/Netlify)
```

## Evolução Planejada

### Fase 1: Refatoração (Atual) 🟡
- [x] Estrutura de tipos
- [x] Extração de utilitários
- [x] Documentação
- [ ] Migração completa de componentes
- [ ] Refatoração do App.tsx

### Fase 2: Hooks & Services 📅
- [ ] Criar hooks customizados
- [ ] Implementar services layer
- [ ] Context API para estado global

### Fase 3: Performance 📅
- [ ] Code splitting
- [ ] Lazy loading
- [ ] PWA implementation

### Fase 4: Testing 📅
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

---

**Última atualização:** 22/03/2026
