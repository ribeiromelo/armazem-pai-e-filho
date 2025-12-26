#!/bin/bash
# Script para aplicar o footer do usuário em todas as páginas

pages=(
  "dashboard-page.ts"
  "fornecedores-page.ts"
  "fichas-page.ts"
  "recibos-page.ts"
  "financeiro-page.ts"
  "usuarios-page.ts"
)

for page in "${pages[@]}"; do
  echo "Processando $page..."
  
  # Verificar se já tem o footer
  if grep -q "absolute bottom-0 w-64" "$page"; then
    echo "  ✅ $page já tem o footer"
  else
    echo "  🔧 Adicionando footer em $page"
    
    # Encontrar onde está </nav> e adicionar o footer depois
    # Primeiro fazer backup
    cp "$page" "$page.backup-$(date +%H%M%S)"
    
    # Adicionar o footer (vou fazer manualmente em cada arquivo)
  fi
done

echo "✅ Verificação concluída"
