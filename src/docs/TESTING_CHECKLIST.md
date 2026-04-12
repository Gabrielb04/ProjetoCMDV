# 🧪 Checklist de Testes - Carteira Digital de Manutenção

## 📋 Guia de Testes Completo

Este documento contém todos os cenários que devem ser testados para garantir que a aplicação está funcionando corretamente após a refatoração.

---

## 1️⃣ Autenticação e Sessão

### 1.1 Registro de Novo Usuário
- [ ] Abrir a aplicação pela primeira vez
- [ ] Clicar em "Criar nova conta"
- [ ] Preencher todos os campos obrigatórios:
  - [ ] Nome completo
  - [ ] Email válido
  - [ ] Senha (mínimo 6 caracteres)
- [ ] Clicar em "Criar Conta"
- [ ] Verificar se é redirecionado para cadastro de veículo
- [ ] Verificar se mensagem de sucesso aparece

### 1.2 Login de Usuário Existente
- [ ] Fazer logout se estiver logado
- [ ] Inserir email e senha corretos
- [ ] Clicar em "Entrar"
- [ ] Verificar se é redirecionado para:
  - [ ] Seleção de veículo (se já tem veículos cadastrados)
  - [ ] Cadastro de veículo (se é primeiro acesso)
- [ ] Verificar se dados do usuário foram carregados

### 1.3 Persistência de Sessão
- [ ] Fazer login
- [ ] Fechar o navegador
- [ ] Abrir novamente
- [ ] Verificar se continua logado
- [ ] Verificar se dados foram mantidos

### 1.4 Logout
- [ ] Clicar no botão de logout
- [ ] Verificar se foi redirecionado para tela de login
- [ ] Verificar se dados foram salvos antes do logout
- [ ] Tentar acessar área logada (deve redirecionar para login)

---

## 2️⃣ Gerenciamento de Veículos

### 2.1 Cadastro de Primeiro Veículo
- [ ] Preencher todos os campos:
  - [ ] Marca (ex: Toyota)
  - [ ] Modelo (ex: Corolla)
  - [ ] Ano (ex: 2020)
  - [ ] Placa (ex: ABC-1234)
  - [ ] Quilometragem atual (ex: 50000)
- [ ] Clicar em "Cadastrar Veículo"
- [ ] Verificar se é redirecionado para o Dashboard
- [ ] Verificar se veículo aparece no Dashboard

### 2.2 Cadastro de Veículos Adicionais
- [ ] Ir para seleção de veículos
- [ ] Clicar em "Cadastrar Novo Veículo"
- [ ] Preencher dados do novo veículo
- [ ] Cadastrar
- [ ] Verificar se ambos os veículos aparecem na lista

### 2.3 Seleção de Veículo
- [ ] Acessar seleção de veículos
- [ ] Verificar se todos os veículos cadastrados aparecem
- [ ] Clicar em um veículo
- [ ] Verificar se:
  - [ ] Dashboard carrega com dados do veículo correto
  - [ ] Aparece popup de atualização de km (se não for primeiro acesso)

### 2.4 Exclusão de Veículo
- [ ] Ir para seleção de veículos
- [ ] Clicar no ícone de lixeira de um veículo
- [ ] Confirmar exclusão
- [ ] Verificar se:
  - [ ] Veículo foi removido da lista
  - [ ] Dados de manutenção foram deletados
  - [ ] Se era o último veículo, redireciona para cadastro

### 2.5 Atualização de Quilometragem
- [ ] Acessar um veículo (não no primeiro acesso)
- [ ] Popup de atualização de km deve aparecer
- [ ] Inserir nova quilometragem (maior que a atual)
- [ ] Confirmar atualização
- [ ] Verificar se:
  - [ ] Quilometragem foi atualizada no veículo
  - [ ] Alertas foram recalculados
  - [ ] Progresso dos alertas mudou

### 2.6 Skip de Atualização de Km
- [ ] Quando aparecer popup de km
- [ ] Clicar em "Pular por Hoje"
- [ ] Verificar se:
  - [ ] Popup fecha
  - [ ] Dashboard carrega normalmente
  - [ ] No mesmo dia, popup não aparece novamente

---

## 3️⃣ Gestão de Manutenção - Peças

### 3.1 Adicionar Peça ao Painel
- [ ] No Dashboard, clicar em "Nova Manutenção"
- [ ] Selecionar tipo "Troca de Peças"
- [ ] Escolher uma peça da lista (ex: Óleo de Motor)
- [ ] Preencher dados:
  - [ ] Data da última troca
  - [ ] Quilometragem da última troca
  - [ ] Custo estimado (campo obrigatório com R$)
  - [ ] Alerta por quilometragem (ex: 10000 km)
  - [ ] ✅ Marcar "Ativar alerta por data"
  - [ ] Próxima data de alerta (ex: daqui 6 meses)
  - [ ] Observações (opcional)
- [ ] Clicar em "Adicionar Item"
- [ ] Verificar se:
  - [ ] Peça aparece no painel do Dashboard
  - [ ] Aparece no histórico com todas as informações
  - [ ] Status inicial é "OK" (verde)

### 3.2 Adicionar Peça SEM Alerta de Data
- [ ] Adicionar nova peça
- [ ] ❌ Desmarcar "Ativar alerta por data"
- [ ] Campo de data deve ficar desabilitado
- [ ] Preencher apenas:
  - [ ] Data da última troca
  - [ ] Km da última troca
  - [ ] Custo
  - [ ] Alerta por km
- [ ] Adicionar
- [ ] Verificar se item foi criado apenas com alerta de km

### 3.3 Adicionar Peça SEM Nenhum Alerta
- [ ] Adicionar nova peça
- [ ] ❌ Desmarcar "Ativar alerta por data"
- [ ] Deixar "Alerta por km" vazio
- [ ] Preencher dados básicos e custo
- [ ] Adicionar
- [ ] Verificar se:
  - [ ] Item vai direto para o histórico
  - [ ] NÃO aparece no painel de alertas

### 3.4 Registrar Troca de Peça Existente
- [ ] No painel de alertas, clicar em uma peça
- [ ] Clicar em "Registrar Manutenção"
- [ ] Preencher:
  - [ ] Data da manutenção (padrão: hoje)
  - [ ] Quilometragem atual
  - [ ] Custo da manutenção (obrigatório com R$)
  - [ ] ✅ "Ativar alerta por data" (deve vir marcado se tinha antes)
  - [ ] Nova data de alerta
  - [ ] Observações (opcional)
- [ ] ✅ Manter "Manter no Painel" marcado
- [ ] Clicar em "Registrar"
- [ ] Verificar se:
  - [ ] Item continua no painel com km base atualizado
  - [ ] Novo registro aparece no topo do histórico
  - [ ] Progresso foi zerado
  - [ ] Próxima data de alerta foi atualizada

### 3.5 Registrar e Remover do Painel
- [ ] Registrar manutenção de uma peça
- [ ] ❌ Desmarcar "Manter no Painel"
- [ ] Registrar
- [ ] Verificar se:
  - [ ] Item foi removido do painel
  - [ ] Registro aparece no histórico marcando remoção
  - [ ] Pode adicionar novamente se necessário

---

## 4️⃣ Gestão de Manutenção - Serviços

### 4.1 Adicionar Serviço ao Painel
- [ ] Clicar em "Nova Manutenção"
- [ ] Selecionar tipo "Serviços"
- [ ] Escolher serviço (ex: Alinhamento e Balanceamento)
- [ ] Preencher todos os dados (igual às peças)
- [ ] Verificar se custo é obrigatório com prefixo R$
- [ ] Adicionar
- [ ] Verificar se serviço aparece diferenciado no painel

### 4.2 Serviço com Alerta de Data
- [ ] Adicionar serviço (ex: Revisão Geral)
- [ ] ✅ Ativar alerta por data
- [ ] Definir data futura (ex: 3 meses)
- [ ] Adicionar
- [ ] Verificar se alerta de data está funcionando

### 4.3 Registrar Serviço Realizado
- [ ] Clicar em um serviço no painel
- [ ] Registrar manutenção com nova data
- [ ] Verificar atualização correta

---

## 5️⃣ Sistema de Alertas

### 5.1 Alertas por Quilometragem
- [ ] Criar item com alerta de 10000 km
- [ ] Km base: 50000
- [ ] Atualizar veículo para:
  - [ ] 57500 km → Status deve ser OK (verde) - 75%
  - [ ] 58000 km → Status deve ser EM BREVE (amarelo) - 80%
  - [ ] 59900 km → Status deve ser EM BREVE (amarelo) - 99%
  - [ ] 60000 km → Status deve ser VENCIDO (vermelho) - 100%
  - [ ] 61000 km → Status deve ser VENCIDO (vermelho) - 110%

### 5.2 Alertas por Data
- [ ] Criar item com alerta daqui a 10 dias
- [ ] Verificar barra de progresso:
  - [ ] Deve mostrar ~85% (amarelo - Em Breve)
- [ ] Criar item com alerta de amanhã:
  - [ ] Deve mostrar ~92% (amarelo - Em Breve)
- [ ] Criar item com data passada:
  - [ ] Deve mostrar 100% (vermelho - Vencido)

### 5.3 Alertas Combinados (Km + Data)
- [ ] Criar item com ambos os alertas
- [ ] Verificar que o status mais crítico prevalece:
  - [ ] Se km está vencido e data ok → VENCIDO
  - [ ] Se data está vencida e km ok → VENCIDO
  - [ ] Se ambos em breve → EM BREVE
  - [ ] Se ambos ok → OK

---

## 6️⃣ Histórico de Manutenção

### 6.1 Visualização do Histórico
- [ ] Ir para aba "Histórico"
- [ ] Verificar se todos os registros aparecem
- [ ] Verificar ordenação (mais recente primeiro)
- [ ] Verificar informações detalhadas:
  - [ ] Nome do item
  - [ ] Data formatada (dd/mm/yyyy)
  - [ ] Quilometragem com separador de milhar
  - [ ] Custo formatado (R$ 00,00)
  - [ ] Observações completas

### 6.2 Filtros e Busca no Histórico
- [ ] Buscar por nome de peça/serviço
- [ ] Verificar se resultados são filtrados corretamente
- [ ] Limpar busca e verificar se volta ao normal

### 6.3 Exclusão de Registros do Histórico
- [ ] Marcar checkbox de um ou mais registros
- [ ] Clicar em "Excluir Selecionados"
- [ ] Confirmar exclusão
- [ ] Verificar se registros foram removidos
- [ ] Verificar se foram salvos no localStorage

---

## 7️⃣ Dashboard e Estatísticas

### 7.1 Cards de Resumo (5 colunas)
- [ ] Verificar card "Total Gasto":
  - [ ] Soma de todos os custos
  - [ ] Formatação correta (R$ 0.000,00)
- [ ] Verificar card "Alertas Ativos":
  - [ ] Contagem correta de itens no painel
- [ ] Verificar card "OK" (verde):
  - [ ] Contagem de alertas com status ok
- [ ] Verificar card "Em Breve" (amarelo):
  - [ ] Contagem de alertas warning/date-warning
- [ ] Verificar card "Vencidos" (vermelho):
  - [ ] Contagem de alertas overdue/date-overdue

### 7.2 Painel de Alertas
- [ ] Verificar se itens estão ordenados por prioridade:
  - [ ] Vencidos primeiro (vermelho)
  - [ ] Em breve depois (amarelo)
  - [ ] OK por último (verde)
- [ ] Verificar barras de progresso:
  - [ ] Km progress (barra horizontal)
  - [ ] Date progress (barra horizontal separada)
  - [ ] Cores corretas (verde/amarelo/vermelho)
  - [ ] Percentual exibido

### 7.3 Informações dos Itens
- [ ] Verificar se mostra:
  - [ ] Nome da peça/serviço
  - [ ] Tipo (Peça/Serviço)
  - [ ] Km base formatado
  - [ ] Última data de manutenção
  - [ ] Próximo alerta de km (se houver)
  - [ ] Próxima data de alerta (se houver)
  - [ ] Custo estimado formatado

---

## 8️⃣ Controle de Custos

### 8.1 Campo Obrigatório com Prefixo R$
- [ ] Tentar adicionar item sem custo
- [ ] Verificar se campo é obrigatório
- [ ] Inserir valor com prefixo R$ automático
- [ ] Verificar formatação ao digitar:
  - [ ] Digite "50" → deve mostrar "R$ 50"
  - [ ] Digite "150,50" → deve aceitar
  - [ ] Digite "1500.75" → deve converter para R$ 1500,75

### 8.2 Normalização de Custos
- [ ] Inserir valores com diferentes formatos:
  - [ ] "R$ 100" → salvar como 100.00
  - [ ] "50,75" → salvar como 50.75
  - [ ] "1.500,00" → salvar como 1500.00
- [ ] Verificar se ao recarregar mantém valores corretos

### 8.3 Cálculo de Totais
- [ ] Adicionar 3 itens com custos diferentes
- [ ] Verificar se card "Total Gasto" soma corretamente
- [ ] Registrar manutenções com novos custos
- [ ] Verificar se total é atualizado
- [ ] Remover itens do histórico
- [ ] Verificar se total diminui

---

## 9️⃣ Validação de Dados

### 9.1 Validação de Campos Obrigatórios
- [ ] Tentar enviar formulário de peça vazio
- [ ] Verificar mensagens de erro
- [ ] Preencher apenas alguns campos
- [ ] Verificar quais campos ainda precisam ser preenchidos

### 9.2 Validação de Quilometragem
- [ ] Tentar atualizar km com valor menor que atual
- [ ] Verificar se mostra erro
- [ ] Tentar inserir km negativo
- [ ] Tentar inserir texto no lugar de número
- [ ] Inserir km maior que atual (deve aceitar)

### 9.3 Validação de Datas
- [ ] Inserir data inválida (ex: 32/13/2024)
- [ ] Verificar tratamento de erro
- [ ] Inserir data muito antiga
- [ ] Inserir data muito futura
- [ ] Verificar se aceita datas válidas normalmente

---

## 🔟 Persistência de Dados

### 10.1 LocalStorage - Salvamento Automático
- [ ] Adicionar item ao painel
- [ ] Fechar navegador (sem fazer logout)
- [ ] Abrir novamente
- [ ] Verificar se item continua lá
- [ ] Registrar manutenção
- [ ] Recarregar página (F5)
- [ ] Verificar se registro foi salvo

### 10.2 LocalStorage - Múltiplos Veículos
- [ ] Cadastrar 2 veículos diferentes
- [ ] Adicionar itens no veículo 1
- [ ] Trocar para veículo 2
- [ ] Adicionar itens diferentes
- [ ] Voltar para veículo 1
- [ ] Verificar se os itens corretos são carregados

### 10.3 LocalStorage - Múltiplos Usuários
- [ ] Criar usuário 1 com veículos e dados
- [ ] Fazer logout
- [ ] Criar usuário 2 com outros veículos
- [ ] Verificar se dados não se misturam
- [ ] Login novamente com usuário 1
- [ ] Verificar se dados originais foram mantidos

### 10.4 Supabase - Sincronização (se configurado)
- [ ] Fazer login em dispositivo 1
- [ ] Adicionar dados
- [ ] Fazer login no mesmo usuário em dispositivo 2
- [ ] Verificar se dados foram sincronizados
- [ ] Adicionar dados no dispositivo 2
- [ ] Voltar para dispositivo 1
- [ ] Atualizar e verificar sincronização

---

## 1️⃣1️⃣ Interface e Responsividade

### 11.1 Tema Claro/Escuro
- [ ] Alternar entre temas usando toggle
- [ ] Verificar se:
  - [ ] Todas as cores mudam adequadamente
  - [ ] Texto permanece legível
  - [ ] Cards e botões ficam visíveis
  - [ ] Preferência é salva ao recarregar

### 11.2 Responsividade Mobile
- [ ] Redimensionar navegador para mobile (< 768px)
- [ ] Verificar se:
  - [ ] Layout se adapta (coluna única)
  - [ ] Cards de estatísticas empilham
  - [ ] Formulários ficam usáveis
  - [ ] Botões são clicáveis
  - [ ] Texto não quebra de forma estranha

### 11.3 Responsividade Tablet
- [ ] Testar em resolução tablet (768px - 1024px)
- [ ] Verificar se layout intermediário funciona

### 11.4 Desktop
- [ ] Testar em resoluções grandes (> 1024px)
- [ ] Verificar se aproveitamento de espaço é bom
- [ ] Cards de 5 colunas devem aparecer corretamente

---

## 1️⃣2️⃣ Navegação e Fluxos

### 12.1 Fluxo de Novo Usuário
- [ ] Registro → Cadastro de Veículo → Dashboard → Adicionar Item → Registrar Manutenção
- [ ] Verificar se cada transição é suave
- [ ] Verificar se dados são salvos em cada etapa

### 12.2 Fluxo de Usuário Recorrente
- [ ] Login → Seleção de Veículo → Popup de Km → Dashboard
- [ ] Verificar fluidez da navegação

### 12.3 Botões de Navegação
- [ ] Testar todos os botões "Voltar"
- [ ] Testar botão "Trocar Veículo"
- [ ] Testar navegação entre abas (Alertas/Histórico)
- [ ] Verificar se estado é preservado

---

## 1️⃣3️⃣ Cenários de Erro

### 13.1 Dados Corrompidos no LocalStorage
- [ ] Abrir DevTools → Application → LocalStorage
- [ ] Modificar manualmente dados para formato inválido
- [ ] Recarregar aplicação
- [ ] Verificar se:
  - [ ] Aplicação não quebra
  - [ ] Dados corrompidos são limpos
  - [ ] Mensagem de erro é exibida (se aplicável)

### 13.2 LocalStorage Cheio
- [ ] (Difícil de testar, mas considerar)
- [ ] Verificar se há tratamento de erro ao salvar

### 13.3 Conexão com Supabase Falha
- [ ] Desconectar internet
- [ ] Verificar se app continua funcionando em modo offline
- [ ] Reconectar internet
- [ ] Verificar se sincronização ocorre automaticamente

---

## 1️⃣4️⃣ Performance

### 14.1 Carregamento Inicial
- [ ] Abrir DevTools → Network
- [ ] Recarregar página
- [ ] Verificar tempo de carregamento total
- [ ] Verificar se não há requisições desnecessárias

### 14.2 Atualizações de Estado
- [ ] Adicionar 50 itens ao painel
- [ ] Atualizar quilometragem
- [ ] Verificar se interface atualiza rapidamente
- [ ] Não deve haver lag perceptível

### 14.3 Listagens Grandes
- [ ] Criar 100+ registros no histórico
- [ ] Verificar se listagem carrega suavemente
- [ ] Testar busca com muitos resultados

---

## ✅ Checklist de Aprovação Final

### Funcionalidades Críticas
- [ ] ✅ Autenticação (login/logout) funciona
- [ ] ✅ Cadastro e seleção de veículos funciona
- [ ] ✅ Adicionar peças/serviços ao painel funciona
- [ ] ✅ Sistema de alertas (km e data) funciona
- [ ] ✅ Registro de manutenções funciona
- [ ] ✅ Histórico completo funciona
- [ ] ✅ Custos obrigatórios com R$ funcionam
- [ ] ✅ Cards de estatísticas (5 colunas) funcionam
- [ ] ✅ Persistência de dados funciona

### Qualidade
- [ ] ✅ Sem erros no console
- [ ] ✅ Sem warnings críticos
- [ ] ✅ Interface responsiva
- [ ] ✅ Tema claro/escuro funciona
- [ ] ✅ Dados são preservados ao recarregar
- [ ] ✅ Validações impedem erros do usuário

### Documentação
- [ ] ✅ README.md atualizado
- [ ] ✅ ARCHITECTURE.md completo
- [ ] ✅ Código está comentado onde necessário
- [ ] ✅ Types estão documentados

---

## 📊 Relatório de Testes

Após completar todos os testes, preencha:

- **Data dos testes**: ___/___/______
- **Testado por**: _________________
- **Navegador**: _________________
- **Versão**: _________________
- **Resolução**: _________________

### Problemas Encontrados
1. _________________________________
2. _________________________________
3. _________________________________

### Observações
_________________________________
_________________________________
_________________________________

---

**Status Final**: [ ] ✅ Aprovado  [ ] ⚠️ Aprovado com ressalvas  [ ] ❌ Reprovado
