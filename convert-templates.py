#!/usr/bin/env python3
import re
import sys

def convert_template_literal(match):
    """Converte `...${var}...` para '...' + var + '...'"""
    content = match.group(1)
    
    # Dividir por ${...}
    parts = re.split(r'\$\{([^}]+)\}', content)
    
    # Construir concatenação
    result = []
    for i, part in enumerate(parts):
        if i % 2 == 0:  # Texto
            if part:
                result.append("'" + part.replace("'", "\\'") + "'")
        else:  # Variável
            result.append('(' + part + ')')
    
    return ' + '.join(result) if result else "''"

# Ler arquivo
with open('src/pages/feiras-page.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar tag <script>
script_start = content.find('<script>')
script_end = content.find('</script>')

if script_start == -1 or script_end == -1:
    print("❌ Tags <script> não encontradas!")
    sys.exit(1)

# Separar partes
before = content[:script_start + 8]
script = content[script_start + 8:script_end]
after = content[script_end:]

# Converter template literals no script
# Padrão: \`...\` (template literal escapado no TypeScript)
converted = re.sub(r'\\`([^`]*?)\\`', lambda m: convert_template_literal(m), script)

# Juntar
result = before + converted + after

# Salvar
with open('src/pages/feiras-page.ts', 'w', encoding='utf-8') as f:
    f.write(result)

print(f"✅ Convertido! {script.count('\\`')} template literals processados")
