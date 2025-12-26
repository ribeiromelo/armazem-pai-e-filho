import re

pages = [
    "dashboard-page.ts",
    "fornecedores-page.ts", 
    "fichas-page.ts",
    "recibos-page.ts",
    "financeiro-page.ts",
    "usuarios-page.ts"
]

new_footer = '''            <div class="absolute bottom-0 w-64 p-6 border-t border-blue-500">
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium" id="userName">Usuário</p>
                        <p class="text-xs text-blue-200" id="userRole">Carregando...</p>
                    </div>
                </div>
                <button onclick="logout()" class="mt-4 w-full px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-sm transition-colors">
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    Sair
                </button>
            </div>'''

for page in pages:
    print(f"Atualizando {page}...")
    
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Procurar pelo footer antigo e substituir
    pattern = r'<div class="absolute bottom-0 w-64[^>]*>.*?</div>\s*</aside>'
    
    # Substituir mantendo o </aside>
    new_content = re.sub(
        pattern,
        new_footer + '\n        </aside>',
        content,
        flags=re.DOTALL
    )
    
    if new_content != content:
        with open(page, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  ✅ {page} atualizado")
    else:
        print(f"  ⚠️ {page} não encontrou padrão")

print("\n✅ Todas as páginas atualizadas!")
