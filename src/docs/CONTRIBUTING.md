# Guia de Contribuição - CMDV

## 📋 Antes de Começar

1. Leia a [Arquitetura](./ARCHITECTURE.md) do projeto
2. Revise as [Diretrizes](./Guidelines.md)
3. Familiarize-se com a estrutura de pastas

## 🎯 Padrões de Código

### TypeScript

#### Tipos vs Interfaces
```typescript
// ✅ Use interface para objetos
interface User {
  id: string;
  name: string;
}

// ✅ Use type para unions/intersections
type Status = 'ok' | 'warning' | 'overdue';
type UserWithVehicle = User & { vehicleId: string };
```

#### Evite `any`
```typescript
// ❌ Evite
const data: any = fetchData();

// ✅ Prefira
const data: User = fetchData();

// ✅ Ou use unknown se necessário
const data: unknown = fetchData();
if (typeof data === 'object' && data !== null) {
  // Type guard
}
```

### Componentes React

#### Estrutura Padrão
```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface MyComponentProps {
  user: User;
  onSave: (data: User) => void;
}

export function MyComponent({ user, onSave }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave(user);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### Nomenclatura de Props
```typescript
// ✅ Prefixe callbacks com "on"
interface Props {
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

// ✅ Prefixe booleans com "is/has/should"
interface Props {
  isLoading: boolean;
  hasError: boolean;
  shouldShowModal: boolean;
}
```

### Tailwind CSS

#### Ordem de Classes
```typescript
// ✅ Siga a ordem: layout > spacing > sizing > styling > interactivity
className="flex items-center gap-2 p-4 w-full bg-primary text-white hover:bg-primary/90"

// ❌ Evite classes desorganizadas
className="text-white hover:bg-primary/90 bg-primary flex w-full gap-2 p-4 items-center"
```

#### Responsividade
```typescript
// ✅ Mobile-first
className="flex-col md:flex-row"

// ✅ Use breakpoints consistentemente
className="text-sm md:text-base lg:text-lg"
```

## 📁 Onde Colocar Código

### Novo Componente de UI Genérico
```
src/components/ui/my-component.tsx
```

### Novo Componente Compartilhado
```
src/components/shared/MyComponent.tsx
src/components/shared/index.ts  // Adicionar export
```

### Novo Componente de Feature
```
src/features/my-feature/components/MyComponent.tsx
src/features/my-feature/index.ts  // Adicionar export
```

### Nova Função Utilitária
```typescript
// src/utils/my-utils.ts
export const myUtil = () => { ... }

// src/utils/index.ts
export * from './my-utils';
```

### Novo Tipo
```typescript
// src/types/my-domain.ts
export interface MyType { ... }

// src/types/index.ts
export * from './my-domain';
```

### Novo Hook Customizado
```typescript
// src/hooks/useMyHook.ts
export const useMyHook = () => { ... }

// src/hooks/index.ts
export * from './useMyHook';
```

## 🧪 Testando Mudanças

### Checklist Antes de Commit
- [ ] Código compila sem erros (`npm run build`)
- [ ] Tipos TypeScript corretos
- [ ] Imports organizados
- [ ] Sem `console.log` desnecessários
- [ ] Responsividade mobile testada
- [ ] Modo claro e escuro testados
- [ ] LocalStorage funcionando
- [ ] Supabase funcionando (se aplicável)

### Teste Manual
1. **Fluxo de Login**
   - [ ] Login com credenciais válidas
   - [ ] Login com credenciais inválidas
   - [ ] Logout

2. **Fluxo de Veículos**
   - [ ] Cadastrar veículo
   - [ ] Selecionar veículo
   - [ ] Atualizar KM

3. **Fluxo de Manutenção**
   - [ ] Adicionar item ao painel
   - [ ] Registrar manutenção
   - [ ] Visualizar histórico
   - [ ] Alertas funcionando

## 📝 Commits

### Formato
```
tipo(escopo): descrição curta

Descrição detalhada (opcional)

Closes #123 (se aplicável)
```

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `refactor`: Refatoração de código
- `docs`: Documentação
- `style`: Formatação, sem mudança de lógica
- `test`: Adicionar ou modificar testes
- `chore`: Tarefas de manutenção

### Exemplos
```
feat(auth): adicionar validação de email

fix(dashboard): corrigir cálculo de progresso de alertas

refactor(types): extrair tipos para arquivos separados

docs(readme): atualizar instruções de instalação

style(components): formatar código com prettier

chore(deps): atualizar dependências
```

## 🔍 Code Review

### O que Observar
1. **Funcionalidade**: Código faz o que deveria?
2. **Padrões**: Segue os padrões do projeto?
3. **Performance**: Pode ser otimizado?
4. **Legibilidade**: Código é fácil de entender?
5. **Segurança**: Há vulnerabilidades?
6. **Testes**: Funcionalidade está testada?

### Como Dar Feedback
```
// ✅ Construtivo e específico
"Sugiro extrair essa lógica para um hook customizado 
para facilitar reutilização e testes."

// ❌ Vago e negativo
"Esse código está ruim."
```

## 🚀 Pull Requests

### Template
```markdown
## Descrição
[Descreva as mudanças realizadas]

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Refatoração
- [ ] Documentação

## Checklist
- [ ] Código compila sem erros
- [ ] TypeScript sem erros
- [ ] Testado em mobile
- [ ] Testado em modo claro/escuro
- [ ] Documentação atualizada (se necessário)

## Screenshots (se aplicável)
[Adicione screenshots]

## Observações
[Informações adicionais]
```

## 🎨 Convenções de Design

### Espaçamento
```typescript
// ✅ Use classes Tailwind consistentes
gap-2    // 0.5rem - muito pequeno
gap-4    // 1rem - pequeno
gap-6    // 1.5rem - médio
gap-8    // 2rem - grande
```

### Cores
```typescript
// ✅ Use variáveis de tema
className="bg-primary text-primary-foreground"
className="bg-card border-border"
className="text-muted-foreground"

// ❌ Evite cores hardcoded
className="bg-blue-500 text-white"
```

### Ícones
```typescript
// ✅ Tamanhos consistentes
<Icon className="w-4 h-4" />  // Pequeno
<Icon className="w-5 h-5" />  // Médio
<Icon className="w-6 h-6" />  // Grande
```

## 🐛 Reportando Bugs

### Template de Issue
```markdown
**Descrição do Bug**
[Descrição clara do problema]

**Como Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Observe o erro

**Comportamento Esperado**
[O que deveria acontecer]

**Screenshots**
[Se aplicável]

**Ambiente**
- Dispositivo: [ex: iPhone 12]
- Navegador: [ex: Chrome 120]
- Versão: [ex: 1.0.0]

**Informações Adicionais**
[Contexto adicional]
```

## 📚 Recursos Úteis

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Supabase Docs](https://supabase.com/docs)

## 💡 Dicas

1. **Mantenha componentes pequenos**: Máximo ~200 linhas
2. **Extraia lógica complexa**: Use hooks customizados
3. **Priorize legibilidade**: Código é lido mais que escrito
4. **Documente decisões**: Comentários explicam "porquê", não "o quê"
5. **Teste edge cases**: Campos vazios, valores inválidos, etc.

## 🤝 Obtendo Ajuda

Se tiver dúvidas:
1. Verifique a documentação em `/docs`
2. Procure por exemplos similares no código
3. Abra uma issue com a tag `question`

---

**Obrigado por contribuir para o CMDV! 🚗✨**
