#!/bin/bash
# Extrair o JavaScript de Fichas (que funciona) e adaptar para Feiras

echo "Extraindo JavaScript de Fichas..."
git show HEAD:src/pages/fichas-page.ts | grep -A 99999 '<script>' | grep -B 99999 '</script>' | head -n -1 | tail -n +2 > /tmp/fichas.js

echo "Adaptando para Feiras..."
sed -i 's/ficha/feira/g' /tmp/fichas.js
sed -i 's/Ficha/Feira/g' /tmp/fichas.js
sed -i 's/sheets/fairs/g' /tmp/fichas.js
sed -i 's/Fichas/Feiras/g' /tmp/fichas.js

echo "Copiando para static..."
cp /tmp/fichas.js public/static/feiras-adapted.js

echo "Criando página HTML baseada em Fichas..."
# Copiar Fichas e adaptar
git show HEAD:src/pages/fichas-page.ts > src/pages/feiras-page-adapted.ts
sed -i 's/Fichas Semanais/Feiras/g' src/pages/feiras-page-adapted.ts
sed -i 's/Fichas/Feiras/g' src/pages/feiras-page-adapted.ts
sed -i 's/fichas/feiras/g' src/pages/feiras-page-adapted.ts
sed -i 's/Ficha/Feira/g' src/pages/feiras-page-adapted.ts
sed -i 's/ficha/feira/g' src/pages/feiras-page-adapted.ts
sed -i 's/sheets/fairs/g' src/pages/feiras-page-adapted.ts

# Renomear export
sed -i 's/export const fichasPage/export const feirasPage/' src/pages/feiras-page-adapted.ts

echo "✅ Pronto!"
wc -l src/pages/feiras-page-adapted.ts public/static/feiras-adapted.js
