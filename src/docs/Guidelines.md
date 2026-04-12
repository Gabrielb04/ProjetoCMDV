# CMDV - Carteira de Manutenção Digital de Veículos

## Diretrizes do Projeto

### Arquitetura
- **Mobile-first**: O projeto é otimizado prioritariamente para dispositivos móveis
- **Offline-first**: Funciona localmente com localStorage e sincroniza com Supabase quando online
- **Componentização**: Separação clara por domínio usando features/

### Estrutura de Pastas
```
src/
  features/          # Funcionalidades por domínio
    auth/           # Autenticação
    vehicles/       # Gestão de veículos
    maintenance/    # Manutenções e peças
    dashboard/      # Dashboard principal
  components/
    ui/            # Componentes shadcn/ui (genéricos)
    shared/        # Componentes compartilhados do produto
  types/           # Definições de tipos TypeScript
  utils/           # Funções utilitárias
  styles/          # Estilos globais
```

### Padrões de Código
- Usar TypeScript para type safety
- Componentes funcionais com hooks
- Extrair lógica complexa para hooks customizados
- Manter componentes pequenos e focados
- Usar Tailwind CSS v4 para estilização

### Sistema de Alertas
A lógica de alertas segue:
- `progresso = (km_atual - km_base) / alerta_km`
- OK: < 80%
- Em Breve: 80-99%
- Vencido: ≥ 100%

### Dados Pré-configurados
- 10 peças padronizadas
- 10 serviços padronizados
- Valores de mercado brasileiro realistas
- Práticas automotivas reais

### Design System
- shadcn/ui como base
- Tailwind v4
- Modo claro/escuro
- Componentes acessíveis
