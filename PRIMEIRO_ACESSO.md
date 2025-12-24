# 🔐 Instruções para Primeiro Acesso - Armazém Pai e Filho

## 🌐 URL do Sistema
**Produção (Cloudflare Pages)**: https://c3a42197.armazem-pai-filho.pages.dev

## 📋 Passo a Passo para Configurar Acesso

### Opção 1: Resetar Senha do Admin Existente

Execute o comando abaixo para resetar a senha do admin:

```bash
curl -X POST https://c3a42197.armazem-pai-filho.pages.dev/api/auth/emergency-reset-admin \
  -H "Content-Type: application/json" \
  -d '{"new_password": "SUA_SENHA_SEGURA_AQUI"}'
```

**Exemplo com senha "MinhaSenh@2024":**
```bash
curl -X POST https://c3a42197.armazem-pai-filho.pages.dev/api/auth/emergency-reset-admin \
  -H "Content-Type: application/json" \
  -d '{"new_password": "MinhaSenh@2024"}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Senha resetada com sucesso. IMPORTANTE: Remova esta rota após fazer login.",
  "username": "admin"
}
```

Depois, faça login com:
- **Username**: `admin`
- **Senha**: A senha que você definiu acima

### Opção 2: Criar Novo Admin (se não existir)

```bash
curl -X POST https://c3a42197.armazem-pai-filho.pages.dev/api/auth/setup-admin \
  -H "Content-Type: application/json"
```

Isso criará:
- **Username**: `admin`
- **Senha**: `admin123` (MUDE IMEDIATAMENTE após login!)

## ⚠️ IMPORTANTE - Segurança

### 1. Após fazer login com sucesso:
   - Vá em **Usuários** no menu
   - Clique em "Editar" no usuário admin
   - **MUDE A SENHA IMEDIATAMENTE**

### 2. Remover rota de emergência:
   Após configurar o acesso, **remova** a rota `/emergency-reset-admin` do código:
   
   ```bash
   # No arquivo src/routes/auth.ts
   # Delete todo o bloco da rota '/emergency-reset-admin'
   ```

   Depois faça novo deploy:
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name armazem-pai-filho
   ```

## 🔒 Segurança Implementada

- ✅ PBKDF2 (100.000 iterações + salt aleatório)
- ✅ HMAC-SHA256 para JWT
- ✅ Validação com Zod
- ✅ CORS restritivo
- ✅ Prepared Statements (anti SQL Injection)

## 🆘 Problemas?

1. **Erro "Admin já existe"**: Use a Opção 1 (reset de senha)
2. **Erro 404**: Aguarde 1-2 minutos após deploy
3. **Erro de conexão**: Verifique se a URL está correta

## 📊 URLs Úteis

- **Produção**: https://c3a42197.armazem-pai-filho.pages.dev
- **GitHub**: https://github.com/ribeiromelo/armazem-pai-e-filho
- **Dashboard Cloudflare**: https://dash.cloudflare.com/

---

**Criado em**: 2025-12-24
**Sistema**: Armazém Pai e Filho - Sistema de Gestão
