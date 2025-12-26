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
        <!-- Sidebar -->
        <aside class="w-64 bg-blue-600 text-white p-4">
            <h1 class="text-xl font-bold mb-8">Armazém P&F</h1>
            <nav class="space-y-2">
                <a href="/dashboard" class="block p-2 rounded hover:bg-blue-700">Dashboard</a>
                <a href="/feiras" class="block p-2 rounded bg-blue-800">Feiras</a>
            </nav>
            <button onclick="logout()" class="mt-8 w-full p-2 bg-red-500 rounded hover:bg-red-600">Sair</button>
        </aside>
        
        <!-- Main -->
        <main class="flex-1 p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Feiras</h2>
                <button onclick="openModal()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Nova Feira</button>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-4 rounded shadow">
                    <div class="text-sm text-gray-600">Total</div>
                    <div class="text-2xl font-bold text-blue-600" id="totalFairs">0</div>
                </div>
                <div class="bg-white p-4 rounded shadow">
                    <div class="text-sm text-gray-600">Faturamento</div>
                    <div class="text-2xl font-bold text-green-600" id="totalRevenue">R$ 0,00</div>
                </div>
                <div class="bg-white p-4 rounded shadow">
                    <div class="text-sm text-gray-600">Média</div>
                    <div class="text-2xl font-bold text-purple-600" id="avgRevenue">R$ 0,00</div>
                </div>
                <div class="bg-white p-4 rounded shadow">
                    <div class="text-sm text-gray-600">Melhor</div>
                    <div class="text-2xl font-bold text-orange-600" id="maxRevenue">R$ 0,00</div>
                </div>
            </div>
            
            <!-- Table -->
            <div class="bg-white rounded shadow overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criada por</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="fairsTable">
                        <tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">Carregando...</td></tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
    
    <script>
    // Auth
    const TOKEN = localStorage.getItem('token');
    if (!TOKEN) window.location.href = '/';
    
    window.logout = function() {
        localStorage.clear();
        window.location.href = '/';
    };
    
    window.openModal = function() {
        alert('Modal de criação - A implementar');
    };
    
    // Load fairs using DOM
    async function loadFairs() {
        try {
            const res = await fetch('/api/fairs', {
                headers: { 'Authorization': 'Bearer ' + TOKEN }
            });
            const fairs = await res.json();
            
            const tbody = document.getElementById('fairsTable');
            tbody.innerHTML = '';
            
            if (fairs.length === 0) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 7;
                td.className = 'px-6 py-4 text-center text-gray-500';
                td.textContent = 'Nenhuma feira encontrada';
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }
            
            fairs.forEach(fair => {
                const tr = document.createElement('tr');
                tr.className = 'border-b hover:bg-gray-50';
                
                // Data
                const tdDate = document.createElement('td');
                tdDate.className = 'px-6 py-4';
                tdDate.textContent = fair.date;
                tr.appendChild(tdDate);
                
                // Local
                const tdLocation = document.createElement('td');
                tdLocation.className = 'px-6 py-4';
                tdLocation.textContent = fair.location;
                tr.appendChild(tdLocation);
                
                // Status
                const tdStatus = document.createElement('td');
                tdStatus.className = 'px-6 py-4';
                const badge = document.createElement('span');
                badge.className = fair.status === 'finalized' 
                    ? 'px-2 py-1 text-xs rounded bg-green-100 text-green-800'
                    : 'px-2 py-1 text-xs rounded bg-blue-100 text-blue-800';
                badge.textContent = fair.status === 'finalized' ? 'Finalizada' : 'Em aberto';
                tdStatus.appendChild(badge);
                tr.appendChild(tdStatus);
                
                // Itens
                const tdItems = document.createElement('td');
                tdItems.className = 'px-6 py-4';
                tdItems.textContent = (fair.items_count || 0) + ' itens';
                tr.appendChild(tdItems);
                
                // Valor
                const tdValue = document.createElement('td');
                tdValue.className = 'px-6 py-4';
                tdValue.textContent = 'R$ ' + parseFloat(fair.total_value || 0).toFixed(2).replace('.', ',');
                tr.appendChild(tdValue);
                
                // Criada por
                const tdCreator = document.createElement('td');
                tdCreator.className = 'px-6 py-4';
                tdCreator.textContent = fair.created_by_name || 'N/A';
                tr.appendChild(tdCreator);
                
                // Ações
                const tdActions = document.createElement('td');
                tdActions.className = 'px-6 py-4';
                
                const btnView = document.createElement('button');
                btnView.className = 'text-blue-600 hover:text-blue-800 mr-2';
                btnView.innerHTML = '<i class="fas fa-eye"></i>';
                btnView.onclick = function() { alert('Ver feira ' + fair.id); };
                tdActions.appendChild(btnView);
                
                if (fair.status !== 'finalized') {
                    const btnFinalize = document.createElement('button');
                    btnFinalize.className = 'text-green-600 hover:text-green-800 mr-2';
                    btnFinalize.innerHTML = '<i class="fas fa-check-circle"></i>';
                    btnFinalize.title = 'Finalizar';
                    btnFinalize.onclick = function() { alert('Finalizar feira ' + fair.id); };
                    tdActions.appendChild(btnFinalize);
                }
                
                tr.appendChild(tdActions);
                tbody.appendChild(tr);
            });
            
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
    
    // Init
    loadFairs();
    </script>
</body>
</html>
`;
