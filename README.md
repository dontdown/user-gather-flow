# UNIAGRO - Sistema de Cadastro de Usuários

Sistema de questionário para coleta de dados de usuários com integração ao Supabase.

## 🚀 Funcionalidades

- Formulário responsivo de cadastro de usuários
- Validação em tempo real (CPF, CEP, telefone)
- Integração com ViaCEP para busca automática de endereços
- Verificação de CPF duplicado
- Salvamento automático no banco Supabase
- Interface moderna com Tailwind CSS

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Netlify

## 📦 Instalação Local

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd user-gather-flow

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

## 🌐 Deploy no Netlify

### Configuração Automática (Recomendado)

1. **Fork/Clone este repositório**

2. **Configure o Netlify:**
   - Acesse [netlify.com](https://netlify.com)
   - Clique em "New site from Git"
   - Conecte seu repositório GitHub
   - Configure as seguintes opções:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Node version**: `18`

3. **Configure as Variáveis de Ambiente:**
   - No painel do Netlify, vá para: `Site settings > Environment variables`
   - Adicione as seguintes variáveis:
     ```
     VITE_SUPABASE_URL=sua_url_do_supabase
     VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
     ```

4. **Deploy:**
   - Clique em "Deploy site"
   - O site será construído automaticamente

### Configuração Manual

Se preferir fazer o deploy manual:

```bash
# 1. Faça o build de produção
npm run build

# 2. O diretório 'dist' conterá os arquivos prontos para deploy
```

## � Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes da biblioteca shadcn/ui
│   └── SinglePageForm.tsx  # Formulário principal
├── services/            # Camada de serviços
│   └── database.ts      # Integração com Supabase
├── lib/                 # Utilitários
│   ├── supabase.ts      # Configuração do Supabase
│   ├── validations.ts   # Funções de validação
│   └── utils.ts         # Utilitários gerais
├── types/               # Definições de tipos TypeScript
│   └── form.ts          # Tipos do formulário
└── hooks/               # Custom hooks
    └── use-toast.ts     # Hook para notificações
```

## 🔐 Configuração do Supabase

1. **Crie um projeto no Supabase**
2. **Configure a tabela `cadastro_inicial`** (SQL disponível nos comentários do código)
3. **Obtenha as credenciais:**
   - URL do projeto
   - Chave anônima (anon key)
4. **Configure as variáveis de ambiente**

## 🚨 Problemas Comuns

### Build Errors no Netlify

- ✅ **Configurado**: Redirects para SPA (`netlify.toml`)
- ✅ **Configurado**: Variáveis de ambiente
- ✅ **Configurado**: Node.js 18
- ✅ **Configurado**: Build command correto

### Variáveis de Ambiente

Certifique-se de configurar no Netlify:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📞 Suporte

Para problemas com o deploy ou configuração, verifique:
1. As variáveis de ambiente estão configuradas corretamente
2. O projeto Supabase está ativo
3. As permissões RLS estão configuradas (se necessário)

---

**Status**: ✅ Pronto para produção com deploy no Netlify
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/37d5143d-7731-40eb-bda6-2203ed28cbd6) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
