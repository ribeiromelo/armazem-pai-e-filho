#!/usr/bin/env python3
import re

# Ler arquivo
with open('feiras-page-original-working.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar onde começa o <script>
script_start = content.find('<script>')
if script_start == -1:
    print("❌ Tag <script> não encontrada!")
    exit(1)

# Encontrar onde termina o </script>
script_end = content.find('</script>')
if script_end == -1:
    print("❌ Tag </script> não encontrada!")
    exit(1)

# Separar em três partes: antes do script, script, depois do script
before_script = content[:script_start + 8]  # até depois de <script>
script_content = content[script_start + 8:script_end]
after_script = content[script_end:]

# ESCAPAR TODAS as template strings dentro do JavaScript
# Substituir ${...} por \${...}
script_fixed = script_content.replace('${', r'\${')

# Juntar tudo de volta
result = before_script + script_fixed + after_script

# Salvar
with open('feiras-page.ts', 'w', encoding='utf-8') as f:
    f.write(result)

print(f"✅ Arquivo corrigido!")
print(f"   - Linhas: {len(result.splitlines())}")
print(f"   - Template strings escapadas: {script_content.count('${')} ocorrências")
