export const recibosPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibos - Armazém Pai e Filho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js"></script>
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }
        
        /* Sidebar Mobile Toggle */
        #sidebar {
            transition: transform 0.3s ease-in-out;
        }
        
        @media (max-width: 768px) {
            #sidebar {
                position: fixed;
                z-index: 40;
                transform: translateX(-100%);
            }
            
            #sidebar.active {
                transform: translateX(0);
            }
            
            #overlay {
                display: none;
                position: fixed;
                inset: 0;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 30;
            }
            
            #overlay.active {
                display: block;
            }
        }
        
        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            animation: fadeIn 0.3s;
        }
        
        .modal.active {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 12px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideIn 0.3s;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        /* Toast Notification Styles */
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 300px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        }
        
        .toast.success {
            border-left: 4px solid #10b981;
        }
        
        .toast.error {
            border-left: 4px solid #ef4444;
        }
        
        .toast.warning {
            border-left: 4px solid #f59e0b;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .toast.hiding {
            animation: slideOutRight 0.3s ease-out;
        }
        
        @media print {
            .no-print { display: none !important; }
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Overlay para mobile -->
    <div id="overlay" onclick="toggleSidebar()"></div>
    
    <div class="flex h-screen">
        <!-- Sidebar -->
        <aside id="sidebar" class="w-64 bg-blue-600 text-white md:relative md:translate-x-0">
            <div class="p-6">
                <h1 class="text-2xl font-bold">Armazém P&F</h1>
                <p class="text-blue-200 text-sm mt-1">Sistema de Gestão</p>
            </div>
            
            <nav class="mt-6">
                <a href="/dashboard" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                    <i class="fas fa-dashboard mr-3"></i>
                    Dashboard
                </a>
                <a href="/fornecedores" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                    <i class="fas fa-truck mr-3"></i>
                    Fornecedores
                </a>
                <a href="/fichas" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                    <i class="fas fa-file-invoice mr-3"></i>
                    Fichas Semanais
                </a>
                <a href="/feiras" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                    <i class="fas fa-store mr-3"></i>
                    Feiras
                </a>
                <a href="/recibos" class="flex items-center px-6 py-3 bg-blue-700 border-l-4 border-white">
                    <i class="fas fa-receipt mr-3"></i>
                    Recibos
                </a>
                <a href="/financeiro" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                    <i class="fas fa-chart-line mr-3"></i>
                    Financeiro
                </a>
                <a href="/usuarios" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors" id="usersMenu">
                    <i class="fas fa-users mr-3"></i>
                    Usuários
                </a>
            </nav>
            
            <div class="absolute bottom-0 w-64 p-6">
                <div class="border-t border-blue-500 pt-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium" id="userName">Usuário</p>
                            <p class="text-xs text-blue-200" id="userRole">Função</p>
                        </div>
                        <button onclick="logout()" class="text-blue-200 hover:text-white">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto w-full">
            <!-- Header -->
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="px-4 md:px-8 py-4 flex justify-between items-center">
                    <div class="flex items-center flex-1">
                        <!-- Botão Menu Mobile -->
                        <button onclick="toggleSidebar()" class="md:hidden mr-3 text-gray-600 hover:text-gray-800">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                        
                        <div>
                            <h2 class="text-xl md:text-2xl font-semibold text-gray-800">Recibos</h2>
                            <p class="text-gray-600 text-xs md:text-sm mt-1 hidden sm:block">Gere e gerencie recibos profissionais</p>
                        </div>
                    </div>
                    <button onclick="openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg flex items-center text-sm md:text-base" id="btnAddReceipt">
                        <i class="fas fa-plus mr-1 md:mr-2"></i>
                        <span class="hidden sm:inline">Novo</span>
                        <span class="hidden md:inline"> Recibo</span>
                    </button>
                </div>
            </header>

            <!-- Content -->
            <div class="p-4 md:p-8">
                <!-- Cards de Estatísticas -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs md:text-sm text-gray-600 mb-1">Total de Recibos</p>
                                <p class="text-xl md:text-2xl font-bold text-blue-600" id="totalReceipts">0</p>
                            </div>
                            <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-receipt text-blue-600 text-lg md:text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs md:text-sm text-gray-600 mb-1">Valor Total</p>
                                <p class="text-xl md:text-2xl font-bold text-green-600" id="totalValue">R$ 0,00</p>
                            </div>
                            <div class="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-dollar-sign text-green-600 text-lg md:text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs md:text-sm text-gray-600 mb-1">Valor Médio</p>
                                <p class="text-xl md:text-2xl font-bold text-purple-600" id="avgValue">R$ 0,00</p>
                            </div>
                            <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-chart-line text-purple-600 text-lg md:text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs md:text-sm text-gray-600 mb-1">Maior Recibo</p>
                                <p class="text-xl md:text-2xl font-bold text-orange-600" id="maxValue">R$ 0,00</p>
                            </div>
                            <div class="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-trophy text-orange-600 text-lg md:text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filtros -->
                <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
                    <h3 class="text-base md:text-lg font-semibold mb-3 md:mb-4">Filtros</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Mês</label>
                            <input type="month" id="monthFilter" onchange="loadReceipts()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                            <input type="text" id="recipientFilter" placeholder="Nome do cliente..." onchange="loadReceipts()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="flex items-end">
                            <button onclick="clearFilters()" class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                                <i class="fas fa-undo mr-2"></i>Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Tabela de Recibos -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nº Recibo
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Itens
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valor Total
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Criado por
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200" id="receiptsTable">
                                <tr>
                                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                                        Carregando...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Verificar autenticação
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token) {
            window.location.href = '/';
        }

        // Atualizar informações do usuário
        document.getElementById('userName').textContent = user.name || 'Usuário';
        document.getElementById('userRole').textContent = user.permission === 'admin' ? 'Administrador' : 
                                                          user.permission === 'edit' ? 'Editor' : 'Visualizador';

        // Esconder menu de usuários se não for admin
        if (user.permission !== 'admin') {
            document.getElementById('usersMenu').style.display = 'none';
        }

        // Esconder botão de adicionar se for apenas visualizador
        if (user.permission === 'view') {
            document.getElementById('btnAddReceipt').style.display = 'none';
        }

        // Função de logout
        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }

        // Toggle sidebar mobile
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        // Função para mostrar notificações toast
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = \`toast \${type}\`;
            
            const icon = type === 'success' ? 'fa-check-circle' : 
                        type === 'error' ? 'fa-exclamation-circle' : 
                        'fa-exclamation-triangle';
            
            const color = type === 'success' ? 'text-green-600' : 
                         type === 'error' ? 'text-red-600' : 
                         'text-yellow-600';
            
            toast.innerHTML = \`
                <i class="fas \${icon} \${color} text-xl"></i>
                <div class="flex-1">
                    <p class="font-medium text-gray-800">\${message}</p>
                </div>
                <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            \`;
            
            document.body.appendChild(toast);
            
            // Remover automaticamente após 3 segundos
            setTimeout(() => {
                toast.classList.add('hiding');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        let receipts = [];

        // Funções placeholder (serão implementadas na próxima etapa)
        function openModal() {
            showToast('Formulário de recibo será implementado em breve', 'warning');
        }

        function clearFilters() {
            document.getElementById('monthFilter').value = '';
            document.getElementById('recipientFilter').value = '';
            loadReceipts();
        }

        // Carregar recibos
        async function loadReceipts() {
            try {
                const month = document.getElementById('monthFilter').value;
                const recipient = document.getElementById('recipientFilter').value;
                
                let url = '/api/receipts?';
                if (month) url += \`month=\${month}&\`;
                if (recipient) url += \`recipient=\${recipient}&\`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    receipts = await response.json();
                    renderReceipts();
                    loadStats();
                }
            } catch (error) {
                console.error('Erro ao carregar recibos:', error);
            }
        }

        // Carregar estatísticas
        async function loadStats() {
            try {
                const month = document.getElementById('monthFilter').value;
                
                let url = '/api/receipts/stats/summary?';
                if (month) url += \`month=\${month}&\`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    const stats = await response.json();
                    
                    document.getElementById('totalReceipts').textContent = stats.total_receipts;
                    document.getElementById('totalValue').textContent = \`R$ \${stats.total_value.toFixed(2).replace('.', ',')}\`;
                    document.getElementById('avgValue').textContent = \`R$ \${stats.average_value.toFixed(2).replace('.', ',')}\`;
                    document.getElementById('maxValue').textContent = \`R$ \${stats.max_value.toFixed(2).replace('.', ',')}\`;
                }
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            }
        }

        // Renderizar recibos
        function renderReceipts() {
            const html = receipts.map(receipt => {
                // Formatar data no padrão brasileiro
                const date = new Date(receipt.date + 'T00:00:00-03:00');
                const formattedDate = date.toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    timeZone: 'America/Fortaleza'
                });
                
                return \`
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">\${receipt.receipt_number}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${formattedDate}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">\${receipt.recipient_name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${receipt.items_count} itens</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-semibold text-green-600">R$ \${receipt.total_value.toFixed(2).replace('.', ',')}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${receipt.created_by_name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="viewReceipt(\${receipt.id})" class="text-blue-600 hover:text-blue-900 mr-2" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="downloadPDF(\${receipt.id})" class="text-green-600 hover:text-green-900 mr-2" title="Baixar PDF">
                            <i class="fas fa-file-pdf"></i>
                        </button>
                        \${user.permission !== 'view' ? \`
                            <button onclick="editReceipt(\${receipt.id})" class="text-yellow-600 hover:text-yellow-900 mr-2" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                        \` : ''}
                        \${user.permission === 'admin' ? \`
                            <button onclick="deleteReceipt(\${receipt.id})" class="text-red-600 hover:text-red-900" title="Deletar">
                                <i class="fas fa-trash"></i>
                            </button>
                        \` : ''}
                    </td>
                </tr>
            \`;
            }).join('');
            
            document.getElementById('receiptsTable').innerHTML = html || \`
                <tr>
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                        Nenhum recibo encontrado
                    </td>
                </tr>
            \`;
        }

        // Funções placeholder (continuação da próxima etapa)
        function viewReceipt(id) {
            showToast('Preview será implementado em breve', 'warning');
        }

        function downloadPDF(id) {
            showToast('Geração de PDF será implementada em breve', 'warning');
        }

        function editReceipt(id) {
            showToast('Edição será implementada em breve', 'warning');
        }

        async function deleteReceipt(id) {
            if (!confirm('Tem certeza que deseja deletar este recibo?')) return;
            
            try {
                const response = await fetch(\`/api/receipts/\${id}\`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    showToast('Recibo deletado com sucesso!', 'success');
                    loadReceipts();
                } else {
                    showToast('Erro ao deletar recibo', 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao deletar recibo', 'error');
            }
        }

        // Definir mês atual no filtro
        const now = new Date();
        document.getElementById('monthFilter').value = now.toISOString().slice(0, 7);

        // Carregar dados ao iniciar
        loadReceipts();
    </script>
</body>
</html>`;
