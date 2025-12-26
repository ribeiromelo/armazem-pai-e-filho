export const feirasPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feiras - Armazém Pai e Filho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="flex min-h-screen">
        <!-- Sidebar simplificada -->
        <aside class="w-64 bg-blue-600 text-white p-4">
            <h1 class="text-xl font-bold mb-8">Armazém P&F</h1>
            <nav class="space-y-2">
                <a href="/dashboard" class="block p-2 rounded hover:bg-blue-700">Dashboard</a>
                <a href="/fornecedores" class="block p-2 rounded hover:bg-blue-700">Fornecedores</a>
                <a href="/fichas" class="block p-2 rounded hover:bg-blue-700">Fichas</a>
                <a href="/feiras" class="block p-2 rounded bg-blue-800">Feiras</a>
                <a href="/recibos" class="block p-2 rounded hover:bg-blue-700">Recibos</a>
            </nav>
            <button onclick="logout()" class="mt-8 w-full p-2 bg-red-500 rounded hover:bg-red-600">
                Sair
            </button>
        </aside>

        <!-- Conteúdo principal -->
        <main class="flex-1 p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Feiras</h2>
                <button onclick="openModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    + Nova Feira
                </button>
            </div>

            <!-- Estatísticas -->
            <div class="grid grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-4 rounded shadow">
                    <div class="text-sm text-gray-600">Total de Feiras</div>
                    <div class="text-2xl font-bold text-blue-600" id="totalFairs">0</div>
                </div>
                <div class="bg-white p-4 rounded shadow">
                    <div class="text-sm text-gray-600">Faturamento Total</div>
                    <div class="text-2xl font-bold text-green-600" id="totalRevenue">R$ 0,00</div>
                </div>
                <div class="bg-white p-4 rounded shadow">
                    <div class="text-sm text-gray-600">Média por Feira</div>
                    <div class="text-2xl font-bold text-purple-600" id="avgRevenue">R$ 0,00</div>
                </div>
                <div class="bg-white p-4 rounded shadow">
                    <div class="text-sm text-gray-600">Melhor Feira</div>
                    <div class="text-2xl font-bold text-orange-600" id="maxRevenue">R$ 0,00</div>
                </div>
            </div>

            <!-- Tabela de feiras -->
            <div class="bg-white rounded shadow">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="fairsTable">
                        <tr>
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">Carregando...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <!-- Modal Nova Feira -->
    <div id="fairModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-bold mb-4">Nova Feira</h3>
            <form id="fairForm">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Data</label>
                    <input type="date" id="fairDate" required class="w-full border rounded px-3 py-2">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Local</label>
                    <input type="text" id="location" required class="w-full border rounded px-3 py-2">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Itens</label>
                    <div id="itemsContainer"></div>
                    <button type="button" onclick="addItem()" class="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm">
                        + Adicionar Item
                    </button>
                </div>
                <div class="flex gap-2">
                    <button type="button" onclick="closeModal()" class="flex-1 px-4 py-2 bg-gray-200 rounded">
                        Cancelar
                    </button>
                    <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded">
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
    // Globals
    const TOKEN = localStorage.getItem('token');
    if (!TOKEN) window.location.href = '/';

    // Funções globais
    window.logout = function() {
        localStorage.clear();
        window.location.href = '/';
    };

    window.openModal = function() {
        document.getElementById('fairModal').classList.remove('hidden');
        addItem();
    };

    window.closeModal = function() {
        document.getElementById('fairModal').classList.add('hidden');
        document.getElementById('fairForm').reset();
        document.getElementById('itemsContainer').innerHTML = '';
    };

    window.addItem = function() {
        const container = document.getElementById('itemsContainer');
        const div = document.createElement('div');
        div.className = 'flex gap-2 mb-2 item-row';
        div.innerHTML = \`
            <input type="number" placeholder="Qtd" class="item-qty w-20 border rounded px-2 py-1" step="0.01" required>
            <input type="text" placeholder="Categoria" class="item-cat flex-1 border rounded px-2 py-1" required>
            <input type="number" placeholder="Valor" class="item-val w-24 border rounded px-2 py-1" step="0.01" required>
            <button type="button" onclick="this.parentElement.remove()" class="text-red-600">
                <i class="fas fa-trash"></i>
            </button>
        \`;
        container.appendChild(div);
    };

    // Carregar feiras
    async function loadFairs() {
        try {
            const res = await fetch('/api/fairs', {
                headers: { 'Authorization': 'Bearer ' + TOKEN }
            });
            const fairs = await res.json();
            
            const tbody = document.getElementById('fairsTable');
            if (fairs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">Nenhuma feira encontrada</td></tr>';
                return;
            }
            
            tbody.innerHTML = fairs.map(f => \`
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-6 py-4">\${f.id}</td>
                    <td class="px-6 py-4">\${f.location}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs rounded \${f.status === 'finalized' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                            \${f.status === 'finalized' ? 'Finalizada' : 'Em aberto'}
                        </span>
                    </td>
                    <td class="px-6 py-4">\${f.items_count || 0} itens</td>
                    <td class="px-6 py-4">R$ \${parseFloat(f.total_value || 0).toFixed(2).replace('.', ',')}</td>
                    <td class="px-6 py-4">
                        <button onclick="viewFair(\${f.id})" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            \`).join('');
            
            loadStats();
        } catch (err) {
            console.error('Erro:', err);
            alert('Erro ao carregar feiras');
        }
    }

    async function loadStats() {
        try {
            const res = await fetch('/api/fairs/stats/summary', {
                headers: { 'Authorization': 'Bearer ' + TOKEN }
            });
            const stats = await res.json();
            
            document.getElementById('totalFairs').textContent = stats.total_fairs || 0;
            document.getElementById('totalRevenue').textContent = 'R$ ' + (stats.total_revenue || 0).toFixed(2).replace('.', ',');
            document.getElementById('avgRevenue').textContent = 'R$ ' + (stats.average_revenue || 0).toFixed(2).replace('.', ',');
            document.getElementById('maxRevenue').textContent = 'R$ ' + (stats.max_revenue || 0).toFixed(2).replace('.', ',');
        } catch (err) {
            console.error('Erro stats:', err);
        }
    }

    window.viewFair = async function(id) {
        alert('Ver feira ' + id + ' - Implementar visualização');
    };

    // Formulário
    document.getElementById('fairForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const items = [];
        document.querySelectorAll('.item-row').forEach(row => {
            const qty = parseFloat(row.querySelector('.item-qty').value);
            const cat = row.querySelector('.item-cat').value;
            const val = parseFloat(row.querySelector('.item-val').value);
            if (qty && cat && val) {
                items.push({ quantity: qty, category: cat, unit_value: val });
            }
        });
        
        if (items.length === 0) {
            alert('Adicione pelo menos um item');
            return;
        }
        
        const data = {
            date: document.getElementById('fairDate').value,
            location: document.getElementById('location').value,
            items: items
        };
        
        try {
            const res = await fetch('/api/fairs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + TOKEN
                },
                body: JSON.stringify(data)
            });
            
            if (!res.ok) throw new Error('Erro ao criar feira');
            
            alert('Feira criada com sucesso!');
            closeModal();
            loadFairs();
        } catch (err) {
            console.error('Erro:', err);
            alert('Erro ao criar feira');
        }
    });

    // Iniciar
    loadFairs();
    </script>
</body>
</html>
`;
