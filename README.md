# Armazém Pai e Filho - Sistema de Gestão

## Visão Geral
- **Nome**: Armazém Pai e Filho
- **Objetivo**: Sistema completo de gestão para armazém familiar
- **Funcionalidades Principais**: Gestão de fornecedores, fichas semanais, feiras, recibos, controle financeiro e usuários

## URLs de Acesso
- **Produção (Cloudflare Pages)**: https://2105dfad.armazem-pai-filho.pages.dev
- **GitHub**: https://github.com/ribeiromelo/armazem-pai-e-filho
- **Backup do Projeto**: https://www.genspark.ai/api/files/s/ojaFBq3o

## 🔑 Primeiro Acesso
**Veja instruções detalhadas em**: [PRIMEIRO_ACESSO.md](./PRIMEIRO_ACESSO.md)

Após o deploy, use a rota `/api/auth/emergency-reset-admin` (POST) para configurar a senha do administrador. **Importante**: Remova esta rota após o primeiro acesso bem-sucedido.

## Arquitetura de Dados
- **Banco de Dados**: Cloudflare D1 (SQLite)
- **Tabelas Principais**:
  - `users`: Gerenciamento de usuários e permissões
  - `suppliers`: Cadastro de fornecedores
  - `weekly_sheets`: Fichas semanais com controle de fiado e dinheiro
  - `sheet_stock_items`: Itens de estoque das fichas (quantidade × valor)
  - `fairs`: Registro de feiras
  - `fair_items`: Itens vendidos nas feiras
  - `receipts`: Recibos gerados
  - `receipt_items`: Itens dos recibos
- **Autenticação**: JWT simplificado (compatível com Cloudflare Workers)

## Funcionalidades Implementadas ✅
1. **Sistema de Autenticação**
   - Login com JWT
   - Controle de permissões (view, edit, admin)
   - Setup inicial do administrador

2. **Dashboard Principal**
   - Cards com totais (Dinheiro, Fiado, Estoque, Total Geral)
   - Ações rápidas
   - Últimas fichas
   - Fornecedores ativos

3. **Módulo de Fornecedores**
   - CRUD completo
   - Filtros por nome, produto e status
   - Validação de permissões

4. **Módulo de Fichas Semanais** ⭐ ATUALIZADO
   - CRUD completo de fichas
   - **Gestão de estoque com múltiplos itens** (quantidade × valor unitário)
   - **Extração automática de valores do campo fiado** (detecta R$ automaticamente)
   - **Campo de observações com ajustes (+/-)** afetando o total
   - Cálculo automático do total da pasta (estoque + fiado + dinheiro + ajustes)
   - **Modal bonito para visualização detalhada da ficha**
   - **Função de impressão usando html2canvas**
   - **Datas no padrão brasileiro (DD/MM/AAAA)** com fuso horário de Fortaleza
   - Filtros por fornecedor, mês e status de conferência
   - Cards com estatísticas (totais, percentual conferido)
   - Preview em tempo real dos valores
   - Marcação de conferência dupla

5. **Módulo de Feiras** ✅⭐ ATUALIZADO
   - CRUD completo de feiras
   - **Sistema de finalização com cálculo automático de lucros**:
     - Status: "Em aberto" → "Finalizada"
     - Campos para quantidade que voltou e preço de compra
     - **Cálculos automáticos em tempo real**:
       - Quantidade vendida = levada - voltou
       - Faturamento = vendida × preço venda
       - Custo = vendida × preço compra
       - Lucro = faturamento - custo
     - Modal profissional com tabela interativa
     - Totalizadores de faturamento, custo e lucro
   - **Adicionar múltiplos itens** (quantidade × valor unitário)
   - **Cálculo automático do valor total da feira**
   - Filtros por mês e ano
   - **Cards com estatísticas** (total de feiras, faturamento, média, melhor feira)
   - **Modal de visualização detalhada** com impressão
   - **Datas no padrão brasileiro** com fuso horário de Fortaleza
   - Controle de permissões por usuário

6. **Módulo de Recibos** ✅ NOVO - 100% COMPLETO
   - CRUD completo de recibos
   - **Formulário com múltiplos itens** (quantidade × valor unitário)
   - **Cálculo automático em tempo real**
   - **Formatação automática de CPF** durante digitação
   - Filtros por mês e cliente
   - **Cards com estatísticas** (total de recibos, valores, média, maior)
   - **Preview profissional do recibo** com design elegante
   - **Geração de PDF com jsPDF** - Layout corporativo completo:
     - Cabeçalho azul com branding
     - Informações do cliente organizadas
     - Tabela de itens estilizada
     - Espaço para assinatura
     - Observações destacadas
     - Rodapé com dados do sistema
   - **Datas no padrão brasileiro** (DD/MM/AAAA - Fortaleza/CE)
   - Sistema de notificações toast
   - **Totalmente responsivo** (mobile, tablet, desktop)

## Funcionalidades Pendentes 🚧
1. **Módulo Financeiro**
   - Gráficos de fluxo de caixa
   - Comparativos semanais
   - Evolução de dívidas

5. **Módulo de Usuários**
   - Gestão completa de usuários
   - Controle de permissões

## Guia de Uso

### Primeiro Acesso
1. Acesse a URL do sistema
2. Clique em "Criar Admin Inicial" (apenas na primeira vez)
3. Use as credenciais:
   - Usuário: `admin`
   - Senha: `admin123`
4. Após login, você terá acesso total ao sistema

### Navegação
- **Dashboard**: Visão geral com resumos e ações rápidas
- **Fornecedores**: Cadastro e gestão de fornecedores
- **Fichas Semanais**: Controle de fichas (em desenvolvimento)
- **Feiras**: Registro de vendas em feiras (em desenvolvimento)
- **Recibos**: Geração de recibos (em desenvolvimento)
- **Financeiro**: Relatórios e gráficos (em desenvolvimento)
- **Usuários**: Gestão de usuários (apenas admin)

## Tecnologias Utilizadas
- **Backend**: Hono Framework
- **Frontend**: HTML + TailwindCSS + JavaScript Vanilla
- **Banco de Dados**: Cloudflare D1
- **Deployment**: Cloudflare Pages
- **Autenticação**: JWT simplificado
- **Estilização**: TailwindCSS com fonte Poppins
- **Ícones**: Font Awesome

## Comandos de Desenvolvimento
```bash
# Instalar dependências
npm install

# Compilar projeto
npm run build

# Desenvolvimento local
pm2 start ecosystem.config.cjs

# Aplicar migrações no banco local
npm run db:migrate:local

# Resetar banco e aplicar seed
npm run db:reset

# Parar servidor
pm2 delete armazem

# Ver logs
pm2 logs armazem --nostream
```

## 🚀 Deploy no Cloudflare Pages

### Pré-requisitos
- Conta no Cloudflare
- Repositório GitHub configurado
- Wrangler CLI instalado

### Passos para Deploy

1. **Push para GitHub**
   ```bash
   git push origin main
   ```

2. **Criar banco D1 de produção**
   ```bash
   npx wrangler d1 create armazem-production
   # Copiar o database_id gerado
   ```

3. **Aplicar migrações no banco de produção**
   ```bash
   npx wrangler d1 migrations apply armazem-production --remote
   ```

4. **Criar projeto no Cloudflare Pages**
   ```bash
   npx wrangler pages project create armazem-pai-filho --production-branch main
   ```

5. **Deploy para produção**
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name armazem-pai-filho
   ```

6. **Criar usuário administrador inicial**
   - Acesse: `https://armazem-pai-filho.pages.dev/api/auth/setup-admin` (POST)
   - O sistema criará o primeiro admin
   - **IMPORTANTE**: Altere a senha padrão imediatamente após o primeiro acesso

### Segurança Implementada

- ✅ **PBKDF2**: Hashing de senhas com 100.000 iterações + salt aleatório
- ✅ **HMAC-SHA256**: Assinatura JWT usando Web Crypto API
- ✅ **Validação de entrada**: Schema validation com Zod
- ✅ **CORS restritivo**: Whitelist de domínios permitidos
- ✅ **Foreign Key Constraints**: Integridade referencial no banco
- ✅ **Prepared Statements**: Proteção contra SQL Injection

## Próximos Passos Recomendados
1. ~~Implementar módulo de Fichas Semanais com extração automática de valores~~ ✅
2. ~~Criar módulo de Feiras com cálculo automático~~ ✅
3. ~~Implementar geração de recibos em PDF~~ ✅
4. Adicionar gráficos no módulo financeiro usando Chart.js
5. Completar módulo de gestão de usuários
6. Configurar deploy no Cloudflare Pages
7. Adicionar backup automático de dados

## Design System 🎨
- **Framework CSS**: TailwindCSS
- **Fonte**: Poppins (Google Fonts)
- **Esquema de Cores**: Azul/Branco
- **Ícones**: Font Awesome 6
- **Responsividade**: ✅ **TOTALMENTE RESPONSIVO**
  - **Desktop** (lg): Layout completo com sidebar fixa
  - **Tablet** (md): Sidebar toggle, cards em 2-3 colunas
  - **Mobile** (sm): Sidebar overlay, cards empilhados, scroll horizontal em tabelas
- **Formato de Data**: DD/MM/AAAA (Fuso: America/Fortaleza - Ceará)
- **Notificações**: Toast moderno (substituindo alerts nativos)

## Status de Deployment
- **Plataforma**: Cloudflare Pages (preparado)
- **Status**: ✅ Ativo (desenvolvimento)
- **Stack**: Hono + TypeScript + TailwindCSS + Cloudflare D1 + jsPDF
- **Última Atualização**: 15/11/2024 - Módulo de Recibos 100% completo com geração de PDF