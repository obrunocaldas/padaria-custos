# 🥖 Gestão de Custos — Padaria Artesanal

Sistema completo para calcular o custo de receitas e ingredientes da sua padaria.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Vercel](https://vercel.com) (gratuita)
- Conta no [GitHub](https://github.com) (gratuita)

---

## 🚀 Como Publicar (Passo a Passo)

### **ETAPA 1: Configurar o Supabase (Banco de Dados)**

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita

2. Clique em **"New Project"**
   - Escolha um nome (ex: `padaria-custos`)
   - Crie uma senha forte (anote ela!)
   - Escolha a região mais próxima (ex: `South America (São Paulo)`)
   - Clique em **"Create new project"**
   - Aguarde 2-3 minutos enquanto o projeto é criado

3. **Criar as tabelas do banco de dados:**
   - No menu lateral, clique em **"SQL Editor"**
   - Clique em **"+ New query"**
   - Copie TODO o conteúdo do arquivo `supabase/schema.sql` (disponível no projeto)
   - Cole no editor e clique em **"Run"** (ou pressione Ctrl/Cmd + Enter)
   - Você verá "Success. No rows returned" — isso é bom!

4. **Pegar as credenciais:**
   - No menu lateral, clique em **"Settings"** (ícone de engrenagem)
   - Clique em **"API"**
   - Você verá duas informações importantes:
     - **Project URL** (algo como `https://xxxxx.supabase.co`)
     - **anon/public key** (uma chave longa começando com `eyJ...`)
   - **IMPORTANTE:** Deixe essa aba aberta, vamos usar essas credenciais mais tarde!

---

### **ETAPA 2: Subir o Código para o GitHub**

1. Baixe todos os arquivos do projeto para o seu computador

2. Acesse [github.com](https://github.com) e faça login

3. Clique no **"+"** no canto superior direito → **"New repository"**
   - Nome: `padaria-custos` (ou outro nome de sua preferência)
   - Deixe como **Public** (ou Private se preferir)
   - **NÃO** marque "Add a README file"
   - Clique em **"Create repository"**

4. **Subir os arquivos:**
   - Opção A (recomendada): Arraste todos os arquivos do projeto diretamente para a página do GitHub
   - Opção B (via terminal):
     ```bash
     cd /caminho/para/padaria-custos
     git init
     git add .
     git commit -m "Projeto inicial"
     git branch -M main
     git remote add origin https://github.com/SEU_USUARIO/padaria-custos.git
     git push -u origin main
     ```

---

### **ETAPA 3: Deploy na Vercel**

1. Acesse [vercel.com](https://vercel.com) e faça login **com a mesma conta do GitHub**

2. Clique em **"Add New..."** → **"Project"**

3. Você verá a lista dos seus repositórios do GitHub
   - Encontre `padaria-custos` (ou o nome que você deu)
   - Clique em **"Import"**

4. **Configurar variáveis de ambiente:**
   - Em "Environment Variables", adicione 2 variáveis:
   
   **Variável 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Cole o **Project URL** que você copiou do Supabase (passo ETAPA 1, item 4)
   
   **Variável 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Cole a **anon/public key** que você copiou do Supabase (passo ETAPA 1, item 4)

5. Deixe todas as outras configurações no padrão e clique em **"Deploy"**

6. Aguarde 2-3 minutos. Quando terminar, você verá uma tela de sucesso com confetes! 🎉

7. Clique em **"Continue to Dashboard"** e depois no link do seu site (será algo como `padaria-custos.vercel.app`)

---

## ✅ Pronto! Seu App Está no Ar!

Agora você pode:
- Acessar o site de qualquer dispositivo
- Cadastrar ingredientes e receitas
- Tudo fica salvo automaticamente no banco de dados

---

## 📱 Como Usar em Outros Dispositivos

Basta acessar o link do seu site (ex: `https://padaria-custos.vercel.app`) de qualquer navegador:
- Celular
- Tablet
- Outro computador

Os dados são sincronizados automaticamente entre todos os dispositivos!

---

## 🔧 Como Fazer Alterações Depois

Se você quiser mudar algo no código:

1. Edite os arquivos no seu computador
2. Faça commit e push para o GitHub:
   ```bash
   git add .
   git commit -m "Descrição da mudança"
   git push
   ```
3. A Vercel detecta automaticamente e faz deploy automático em ~2 minutos!

---

## 🆘 Problemas Comuns

**"Erro ao conectar com o banco"**
- Verifique se as variáveis de ambiente na Vercel estão corretas
- Vá em Vercel → Settings → Environment Variables
- Confira se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão preenchidas

**"Erro ao criar tabelas"**
- Verifique se executou todo o SQL do arquivo `schema.sql`
- No Supabase, vá em Table Editor e confirme que existem 3 tabelas: `ingredientes`, `receitas`, `receita_ingredientes`

**"Página em branco"**
- Aguarde alguns minutos (o primeiro deploy pode demorar)
- Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
- Abra uma aba anônima e tente novamente

---

## 📞 Suporte

Qualquer dúvida, me mande uma mensagem!

---

Desenvolvido com ❤️ usando Next.js, Supabase e Vercel
