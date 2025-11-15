# Armazém Pai e Filho - Sistema de Gestão

## Visão Geral
- **Nome**: Armazém Pai e Filho
- **Objetivo**: Sistema completo de gestão para armazém familiar
- **Funcionalidades Principais**: Gestão de fornecedores, fichas semanais, feiras, recibos, controle financeiro e usuários

## URLs de Acesso
- **Desenvolvimento**: https://3000-is5kvpf9vmq0ywkrakwpd-0e616f0a.sandbox.novita.ai
- **API Health Check**: https://3000-is5kvpf9vmq0ywkrakwpd-0e616f0a.sandbox.novita.ai/api/health
- **Módulo de Feiras**: https://3000-is5kvpf9vmq0ywkrakwpd-0e616f0a.sandbox.novita.ai/feiras
- **GitHub**: [Será configurado]
- **Backup do Projeto**: https://www.genspark.ai/api/files/s/ojaFBq3o

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

5. **Módulo de Feiras** ✅ NOVO
   - CRUD completo de feiras
   - **Adicionar múltiplos itens** (quantidade × valor unitário)
   - **Cálculo automático do valor total da feira**
   - Filtros por mês e ano
   - **Cards com estatísticas** (total de feiras, faturamento, média, melhor feira)
   - **Modal de visualização detalhada** com impressão
   - **Datas no padrão brasileiro** com fuso horário de Fortaleza
   - Controle de permissões por usuário

## Funcionalidades Pendentes 🚧
1. **Módulo de Recibos**
   - Geração de PDF personalizado
   - Logo e formatação padronizada

4. **Módulo Financeiro**
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

## Próximos Passos Recomendados
1. ~~Implementar módulo de Fichas Semanais com extração automática de valores~~ ✅
2. ~~Criar módulo de Feiras com cálculo automático~~ ✅
3. Implementar geração de recibos em PDF
4. Adicionar gráficos no módulo financeiro usando Chart.js
5. Completar módulo de gestão de usuários
6. Configurar deploy no Cloudflare Pages
7. Adicionar backup automático de dados

## Status de Deployment
- **Plataforma**: Cloudflare Pages (preparado)
- **Status**: ✅ Ativo (desenvolvimento)
- **Stack**: Hono + TypeScript + TailwindCSS + Cloudflare D1
- **Última Atualização**: 14/11/2024 - Design system padronizado em todas as páginas