# 🚀 Guia de Instalação Rápida

**Tempo estimado**: 5 minutos

---

## 📋 Pré-requisitos

Verifique se você tem as versões mínimas instaladas:

```bash
node --version    # Deve ser >= 18.0.0
npm --version     # Deve ser >= 9.0.0
```

Se não tiver, baixe em: https://nodejs.org

---

## 🔧 Instalação em 3 Passos

### 1️⃣ Instalar Dependências

```bash
npm install
```

Isso irá instalar todas as dependências listadas no `package.json`.

**Tempo**: ~2 minutos

---

### 2️⃣ Configurar Ambiente (Opcional)

O projeto funciona **100% offline** sem configuração adicional.

Para habilitar sincronização em nuvem com Supabase:

```bash
# Copiar template
cp .env.example .env.local

# Editar .env.local e adicionar suas credenciais:
# VITE_SUPABASE_URL=https://seu-projeto.supabase.co
# VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

**Tempo**: ~1 minuto (se quiser Supabase)

---

### 3️⃣ Iniciar o Projeto

```bash
npm run dev
```

Abra no navegador: **http://localhost:3000**

**Tempo**: ~10 segundos

---

## ✅ Verificação

Execute estes comandos para garantir que tudo está OK:

```bash
# Verificar TypeScript
npm run type-check

# Verificar linting
npm run lint

# Build de teste
npm run build
```

Se todos passarem ✅, está tudo pronto!

---

## 🎯 Próximos Passos

1. **Explorar o código**
   - Comece por `/src/app/App.tsx` (8 linhas)
   - Veja os hooks em `/src/hooks/`
   - Explore as features em `/src/features/`

2. **Ler documentação**
   - `/docs/QUICK_START.md` - Como usar os hooks
   - `/docs/ARCHITECTURE.md` - Arquitetura do projeto
   - `/docs/HOOKS_USAGE_GUIDE.md` - Guia de hooks

3. **Desenvolver**
   - Adicione suas próprias features
   - Use os hooks existentes
   - Mantenha o padrão de qualidade

---

## 🐛 Problemas Comuns

### ❌ Erro: "Module not found"

**Solução**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Porta 3000 já em uso

**Solução**:
```bash
# Parar processo na porta 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Ou usar outra porta
npm run dev -- --port 3001
```

### ❌ Erro de TypeScript

**Solução**:
```bash
npm run type-check
```

Isso mostrará todos os erros de tipo.

---

## 📚 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verifica código com ESLint |
| `npm run type-check` | Verifica tipos TypeScript |

---

## 🎓 Dicas

1. **Use o VSCode**: O projeto tem configuração otimizada
2. **Instale as extensões recomendadas**: Veja `.vscode/extensions.json`
3. **Format on save**: Já está configurado no projeto
4. **Leia os hooks**: Toda a lógica está nos 6 hooks personalizados

---

## 🆘 Suporte

- 📖 Documentação completa em `/docs/`
- 📋 Veja `CHANGELOG.md` para histórico de mudanças
- 🔍 Consulte `PROJECT_FINAL_STATUS.md` para visão geral

---

**Pronto!** 🎉 Você já pode começar a desenvolver!
