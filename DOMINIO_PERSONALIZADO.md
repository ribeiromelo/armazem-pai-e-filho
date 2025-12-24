# 🌐 Guia: Configurar Domínio Personalizado

## Cenário 1: Domínio já no Cloudflare ✅ FÁCIL

### Via Dashboard (Recomendado)
1. Acesse: https://dash.cloudflare.com
2. **Workers & Pages** → **armazem-pai-filho**
3. Aba **Custom domains** → **Set up a custom domain**
4. Digite seu domínio: `sistema.armazempaifilho.com.br`
5. Cloudflare configura tudo automaticamente
6. Aguarde ~2 minutos para SSL ativo

### Via CLI
```bash
npx wrangler pages domain add sistema.armazempaifilho.com.br \
  --project-name armazem-pai-filho
```

---

## Cenário 2: Domínio em outro registrador

### Opção A: Migrar para Cloudflare (RECOMENDADO)

**Vantagens:**
- ✅ Configuração automática
- ✅ SSL grátis e automático
- ✅ CDN global incluído
- ✅ Proteção DDoS
- ✅ DNS mais rápido

**Passos:**
1. Acesse: https://dash.cloudflare.com
2. Clique em **Add a Site**
3. Digite seu domínio: `armazempaifilho.com.br`
4. Escolha plano **Free**
5. Cloudflare detectará seus DNS atuais
6. **Troque os nameservers no seu registrador:**
   - Registro.br: https://registro.br/
   - GoDaddy: Gerenciador de domínios
   - Hostgator, etc.
   
   Exemplo nameservers Cloudflare:
   ```
   ivan.ns.cloudflare.com
   sharon.ns.cloudflare.com
   ```

7. Aguarde propagação (até 24h, geralmente ~1h)
8. Volte ao **Passo 1** (Dashboard) e adicione domínio customizado

---

### Opção B: Manter registrador atual (MANUAL)

**Desvantagens:**
- ⚠️ Configuração manual
- ⚠️ SSL você precisa gerenciar
- ⚠️ Menos performance

**Passos:**

#### 1. Para domínio raiz (armazempaifilho.com.br)
Adicione no seu registrador:
```
Tipo: CNAME
Nome: @
Destino: armazem-pai-filho.pages.dev
```

Se CNAME em @ não funcionar, use:
```
Tipo: A
Nome: @
Destino: 172.64.147.113  # IP Cloudflare Pages (pode mudar)
```

#### 2. Para subdomínio (sistema.armazempaifilho.com.br)
```
Tipo: CNAME
Nome: sistema
Destino: armazem-pai-filho.pages.dev
```

#### 3. No Cloudflare Pages
```bash
npx wrangler pages domain add sistema.armazempaifilho.com.br \
  --project-name armazem-pai-filho
```

#### 4. Verificação
Cloudflare enviará um registro TXT para validação. Adicione-o no seu registrador:
```
Tipo: TXT
Nome: _cf-custom-hostname.sistema
Valor: (fornecido pelo Cloudflare)
```

#### 5. Aguarde propagação (até 48h)

---

## Após Configuração

### Atualizar CORS no código

Edite `src/index.tsx`:

```typescript
const allowedDomains = [
  'https://armazem-pai-filho.pages.dev',
  'https://sistema.armazempaifilho.com.br',  // Adicione aqui
  'https://armazempaifilho.com.br'           // Se usar domínio raiz
];
```

### Fazer novo deploy
```bash
npm run build
npx wrangler pages deploy dist --project-name armazem-pai-filho
```

---

## Verificar Status

### Via CLI
```bash
# Listar domínios configurados
npx wrangler pages project list

# Ver detalhes do projeto
npx wrangler pages project get armazem-pai-filho
```

### Via Dashboard
https://dash.cloudflare.com → Workers & Pages → armazem-pai-filho → Custom domains

---

## Resolver Problemas Comuns

### "DNS_PROBE_FINISHED_NXDOMAIN"
- Verifique se o CNAME foi criado corretamente
- Aguarde propagação DNS (use: https://dnschecker.org)

### "NET::ERR_CERT_AUTHORITY_INVALID"
- SSL ainda não foi provisionado
- Aguarde até 24h (geralmente ~10 minutos)
- Verifique se está usando HTTPS (não HTTP)

### "This site can't be reached"
- Verifique nameservers (se migrou para Cloudflare)
- Verifique CNAME/A record no registrador
- Teste com: `nslookup sistema.armazempaifilho.com.br`

---

## Custos

- **Cloudflare Pages**: Grátis
- **SSL Certificate**: Grátis (Let's Encrypt via Cloudflare)
- **DNS Cloudflare**: Grátis
- **CDN Global**: Grátis
- **Domínio**: Você já paga ao registrador

---

## Contatos de Suporte

- **Cloudflare**: https://community.cloudflare.com
- **Registro.br**: https://registro.br/suporte/
- **GoDaddy**: https://www.godaddy.com/help

