export const feirasPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feiras - Armazém Pai e Filho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Poppins', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex-shrink-0">
            <div class="p-6">
                <h1 class="text-2xl font-bold">Armazém P&F</h1>
                <p class="text-sm text-blue-200">Sistema de Gestão</p>
            </div>
            <nav class="mt-6">
                <a href="/dashboard" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-home mr-3"></i>Dashboard</a>
                <a href="/fornecedores" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-users mr-3"></i>Fornecedores</a>
                <a href="/fichas" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-file-alt mr-3"></i>Fichas Semanais</a>
                <a href="/feiras" class="flex items-center px-6 py-3 bg-blue-700"><i class="fas fa-store mr-3"></i>Feiras</a>
                <a href="/recebidos" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-shopping-cart mr-3"></i>Recebidos</a>
                <a href="/financeiro" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-dollar-sign mr-3"></i>Financeiro</a>
                <a href="#" onclick="doLogout()" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-sign-out-alt mr-3"></i>Sair</a>
            </nav>
        </aside>

        <!-- Main -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-white shadow-sm">
                <div class="flex items-center justify-between px-6 py-4">
                    <h2 class="text-2xl font-semibold text-gray-800">Feiras</h2>
                    <button onclick="doLogout()" class="text-gray-600 hover:text-gray-800"><i class="fas fa-sign-out-alt"></i></button>
                </div>
            </header>

            <main class="flex-1 overflow-auto bg-gray-50 p-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-semibold">Lista de Feiras</h3>
                        <button onclick="showCreateModal()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            <i class="fas fa-plus mr-2"></i>Nova Feira
                        </button>
                    </div>
                    
                    <div id="fairsList"></div>
                </div>
            </main>
        </div>
    </div>

    <!-- Modal Criar -->
    <div id="createModal" style="display:none;" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 class="text-xl font-bold mb-4">Nova Feira</h3>
            <form id="createForm">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Data</label>
                        <input type="date" id="fairDate" required class="w-full px-3 py-2 border rounded">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Local</label>
                        <input type="text" id="fairLocation" required class="w-full px-3 py-2 border rounded">
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Observações</label>
                    <textarea id="fairObs" class="w-full px-3 py-2 border rounded" rows="3"></textarea>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Itens da Feira</label>
                    <div id="itemsList"></div>
                    <button type="button" onclick="addItem()" class="text-blue-600 hover:text-blue-800 text-sm mt-2">
                        <i class="fas fa-plus mr-1"></i>Adicionar Item
                    </button>
                </div>

                <div class="flex justify-end gap-2">
                    <button type="button" onclick="hideCreateModal()" class="px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <script>
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/';

    function doLogout() {
        localStorage.clear();
        window.location.href = '/';
    }

    let itemCounter = 0;

    function addItem() {
        const div = document.createElement('div');
        div.className = 'grid grid-cols-3 gap-2 mb-2 item-row';
        div.innerHTML = '<input type="text" placeholder="Item" class="px-2 py-1 border rounded item-name" required>' +
                       '<input type="number" placeholder="Qtd" class="px-2 py-1 border rounded item-qty" required>' +
                       '<input type="number" step="0.01" placeholder="Valor Unit." class="px-2 py-1 border rounded item-price" required>';
        document.getElementById('itemsList').appendChild(div);
    }

    function showCreateModal() {
        document.getElementById('createModal').style.display = 'flex';
        document.getElementById('itemsList').innerHTML = '';
        addItem();
    }

    function hideCreateModal() {
        document.getElementById('createModal').style.display = 'none';
        document.getElementById('createForm').reset();
    }

    document.getElementById('createForm').onsubmit = async (e) => {
        e.preventDefault();
        
        const items = [];
        document.querySelectorAll('.item-row').forEach(row => {
            items.push({
                category: row.querySelector('.item-name').value,
                quantity: parseFloat(row.querySelector('.item-qty').value),
                unit_value: parseFloat(row.querySelector('.item-price').value)
            });
        });

        const data = {
            date: document.getElementById('fairDate').value,
            location: document.getElementById('fairLocation').value,
            observations: document.getElementById('fairObs').value,
            items: items
        };

        try {
            const res = await fetch('/api/fairs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert('Feira criada!');
                hideCreateModal();
                loadFairs();
            } else {
                alert('Erro ao criar feira');
            }
        } catch (err) {
            alert('Erro: ' + err.message);
        }
    };

    async function loadFairs() {
        try {
            const res = await fetch('/api/fairs', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const fairs = await res.json();
            
            const html = fairs.length === 0 ? 
                '<p class="text-gray-500 text-center py-8">Nenhuma feira cadastrada</p>' :
                '<table class="w-full"><thead><tr class="border-b"><th class="text-left py-2">Data</th><th class="text-left py-2">Local</th><th class="text-left py-2">Itens</th><th class="text-left py-2">Valor Total</th><th class="text-left py-2">Status</th></tr></thead><tbody>' +
                fairs.map(f => {
                    const date = new Date(f.date + 'T00:00:00').toLocaleDateString('pt-BR');
                    const status = f.status === 'finalized' ? 
                        '<span class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Finalizada</span>' :
                        '<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Em aberto</span>';
                    return '<tr class="border-b hover:bg-gray-50"><td class="py-3">' + date + '</td><td>' + f.location + '</td><td>' + f.items_count + ' itens</td><td>R$ ' + f.total_value.toFixed(2).replace('.', ',') + '</td><td>' + status + '</td></tr>';
                }).join('') +
                '</tbody></table>';
            
            document.getElementById('fairsList').innerHTML = html;
        } catch (err) {
            document.getElementById('fairsList').innerHTML = '<p class="text-red-500">Erro ao carregar: ' + err.message + '</p>';
        }
    }

    loadFairs();
    </script>
</body>
</html>
`;
