#!/bin/bash

# Extrair linhas 1-500 (antes do <script>)
head -500 feiras-page.ts > temp-html.txt

# Criar novo arquivo
echo "export const feirasPage = \`" > feiras-page-new.ts
tail -n +2 temp-html.txt >> feiras-page-new.ts
echo "" >> feiras-page-new.ts
echo "    <!-- JavaScript externo -->" >> feiras-page-new.ts
echo "    <script src=\"/static/feiras.js\"></script>" >> feiras-page-new.ts
echo "</body>" >> feiras-page-new.ts
echo "</html>" >> feiras-page-new.ts
echo "\`;" >> feiras-page-new.ts

# Limpar temp
rm temp-html.txt

echo "✅ Arquivo criado: feiras-page-new.ts"
wc -l feiras-page-new.ts
