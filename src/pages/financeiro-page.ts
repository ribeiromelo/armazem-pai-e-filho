export const financeiroPage = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financeiro - Armazém Pai e Filho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
        }
        
        /* Overlay para fechar sidebar no mobile */
        #overlay {
            display: none;
        }
        
        #overlay.active {
            display: block;
        }
        
        /* Toast notifications */
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 300px;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .toast.success {
            background: #10b981;
            color: white;
        }
        
        .toast.error {
            background: #ef4444;
            color: white;
        }
        
        .toast.warning {
            background: #f59e0b;
            color: white;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Overlay para mobile -->
    <div id="overlay" class="fixed inset-0 bg-black bg-opacity-50 z-30" onclick="toggleSidebar()"></div>

    <div class="flex min-h-screen">
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
                <a href="/recibos" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                    <i class="fas fa-receipt mr-3"></i>
                    Recibos
                </a>
                <a href="/financeiro" class="flex items-center px-6 py-3 bg-blue-700 border-l-4 border-white">
                    <i class="fas fa-chart-line mr-3"></i>
                    Financeiro
                </a>
                <a href="/usuarios" id="usersMenu" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                    <i class="fas fa-users mr-3"></i>
                    Usuários
                </a>
            </nav>
            
                        <div class="absolute bottom-0 w-64 p-6 border-t border-blue-500">
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
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-x-hidden">
            <!-- Header -->
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="px-4 md:px-8 py-4 flex items-center justify-between">
                    <div class="flex items-center">
                        <!-- Botão Menu Mobile -->
                        <button onclick="toggleSidebar()" class="md:hidden mr-4 text-gray-600 hover:text-gray-800">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                        
                        <div>
                            <h2 class="text-xl md:text-2xl font-semibold text-gray-800">Financeiro</h2>
                            <p class="text-gray-600 text-xs md:text-sm mt-1">Visão consolidada das finanças</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2 md:space-x-4">
                        <select id="monthFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                            <!-- Será preenchido via JavaScript -->
                        </select>
                        <button onclick="loadDashboard()" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            </header>

            <div class="p-4 md:p-6 space-y-6">
                <!-- Cards de Fotografia Atual -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-camera text-blue-600 mr-2"></i>
                        Fotografia Atual das Pastas
                    </h3>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-green-500">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-600 text-xs md:text-sm">Dinheiro</span>
                                <i class="fas fa-money-bill-wave text-green-500 text-lg md:text-xl"></i>
                            </div>
                            <p class="text-xl md:text-2xl font-bold text-gray-800" id="currentCash">R$ 0,00</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-purple-500">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-600 text-xs md:text-sm">Estoque</span>
                                <i class="fas fa-boxes text-purple-500 text-lg md:text-xl"></i>
                            </div>
                            <p class="text-xl md:text-2xl font-bold text-gray-800" id="currentStock">R$ 0,00</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-orange-500">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-600 text-xs md:text-sm">Fiado</span>
                                <i class="fas fa-hand-holding-usd text-orange-500 text-lg md:text-xl"></i>
                            </div>
                            <p class="text-xl md:text-2xl font-bold text-gray-800" id="currentCredit">R$ 0,00</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-blue-500">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-600 text-xs md:text-sm">Total Geral</span>
                                <i class="fas fa-wallet text-blue-500 text-lg md:text-xl"></i>
                            </div>
                            <p class="text-xl md:text-2xl font-bold text-gray-800" id="currentTotal">R$ 0,00</p>
                        </div>
                    </div>
                </div>

                <!-- Cards de Movimento do Período -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-calendar-alt text-blue-600 mr-2"></i>
                        Movimento do Período
                    </h3>
                    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-green-500">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-600 text-xs md:text-sm">Feiras</span>
                                <i class="fas fa-store text-green-500 text-lg"></i>
                            </div>
                            <p class="text-lg md:text-xl font-bold text-gray-800" id="periodFairs">R$ 0,00</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-teal-500">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-600 text-xs md:text-sm">Recibos</span>
                                <i class="fas fa-receipt text-teal-500 text-lg"></i>
                            </div>
                            <p class="text-lg md:text-xl font-bold text-gray-800" id="periodReceipts">R$ 0,00</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-blue-500">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-600 text-xs md:text-sm">Total Vendas</span>
                                <i class="fas fa-arrow-up text-blue-500 text-lg"></i>
                            </div>
                            <p class="text-lg md:text-xl font-bold text-gray-800" id="periodRevenue">R$ 0,00</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-red-500">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-600 text-xs md:text-sm">Compras</span>
                                <i class="fas fa-arrow-down text-red-500 text-lg"></i>
                            </div>
                            <p class="text-lg md:text-xl font-bold text-gray-800" id="periodPurchases">R$ 0,00</p>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-4 md:p-6 border-l-4 border-indigo-500">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-600 text-xs md:text-sm">Saldo</span>
                                <i class="fas fa-balance-scale text-indigo-500 text-lg"></i>
                            </div>
                            <p class="text-lg md:text-xl font-bold" id="periodBalance">R$ 0,00</p>
                        </div>
                    </div>
                </div>

                <!-- Gráfico -->
                <div class="bg-white rounded-xl shadow-sm p-4 md:p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-bar text-blue-600 mr-2"></i>
                        Vendas x Compras (Últimos 6 Meses)
                    </h3>
                    <div class="h-64 md:h-80">
                        <canvas id="financeChart"></canvas>
                    </div>
                </div>

                <!-- Tabela de Fornecedores -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="p-4 md:p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">
                            <i class="fas fa-folder text-blue-600 mr-2"></i>
                            Situação das Pastas por Fornecedor
                        </h3>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiado</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dinheiro</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody id="suppliersTable" class="bg-white divide-y divide-gray-200">
                                <!-- Será preenchido via JavaScript -->
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
            
            toast.innerHTML = \`
                <div class="flex items-center space-x-3">
                    <i class="fas \${icon} text-xl"></i>
                    <span>\${message}</span>
                </div>
            \`;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        // Formatar valor para moeda brasileira
        function formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value || 0);
        }

        // Variável global para o gráfico
        let financeChart = null;

        // Carregar dados do dashboard
        async function loadDashboard() {
            try {
                const monthFilter = document.getElementById('monthFilter').value;
                const [year, month] = monthFilter.split('-');
                
                // 1. Carregar overview
                const overviewResponse = await fetch(\`/api/financial/overview?year=\${year}&month=\${month}\`, {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                
                if (overviewResponse.ok) {
                    const overview = await overviewResponse.json();
                    
                    // Atualizar cards de fotografia atual
                    document.getElementById('currentCash').textContent = formatCurrency(overview.current.total_cash);
                    document.getElementById('currentStock').textContent = formatCurrency(overview.current.total_stock);
                    document.getElementById('currentCredit').textContent = formatCurrency(overview.current.total_credit);
                    document.getElementById('currentTotal').textContent = formatCurrency(overview.current.total_general);
                    
                    // Atualizar cards de período
                    document.getElementById('periodFairs').textContent = formatCurrency(overview.period.fairs_revenue);
                    document.getElementById('periodReceipts').textContent = formatCurrency(overview.period.receipts_revenue);
                    document.getElementById('periodRevenue').textContent = formatCurrency(overview.period.total_revenue);
                    document.getElementById('periodPurchases').textContent = formatCurrency(overview.period.total_purchases);
                    
                    const balance = overview.period.balance;
                    const balanceElement = document.getElementById('periodBalance');
                    balanceElement.textContent = formatCurrency(balance);
                    balanceElement.className = \`text-lg md:text-xl font-bold \${balance >= 0 ? 'text-green-600' : 'text-red-600'}\`;
                }
                
                // 2. Carregar resumo de fornecedores
                const suppliersResponse = await fetch('/api/financial/suppliers-summary', {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                
                if (suppliersResponse.ok) {
                    const suppliers = await suppliersResponse.json();
                    renderSuppliersTable(suppliers);
                }
                
                // 3. Carregar dados do gráfico
                const chartResponse = await fetch('/api/financial/chart-data', {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                
                if (chartResponse.ok) {
                    const chartData = await chartResponse.json();
                    renderChart(chartData);
                }
                
            } catch (error) {
                console.error('Erro ao carregar dashboard:', error);
                showToast('Erro ao carregar dados financeiros', 'error');
            }
        }

        // Renderizar tabela de fornecedores
        function renderSuppliersTable(suppliers) {
            const tbody = document.getElementById('suppliersTable');
            
            if (suppliers.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                            Nenhum fornecedor encontrado
                        </td>
                    </tr>
                \`;
                return;
            }
            
            tbody.innerHTML = suppliers.map(supplier => \`
                <tr class="hover:bg-gray-50">
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">\${supplier.supplier_name}</div>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${supplier.product_type}</div>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${formatCurrency(supplier.stock_value)}</div>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${formatCurrency(supplier.credit_value)}</div>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${formatCurrency(supplier.cash)}</div>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-semibold text-gray-900">\${formatCurrency(supplier.total)}</div>
                    </td>
                    <td class="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full \${
                            supplier.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                        }">
                            \${supplier.status === 'active' ? 'Ativo' : 'Quitado'}
                        </span>
                    </td>
                </tr>
            \`).join('');
        }

        // Renderizar gráfico
        function renderChart(data) {
            const ctx = document.getElementById('financeChart').getContext('2d');
            
            // Destruir gráfico anterior se existir
            if (financeChart) {
                financeChart.destroy();
            }
            
            financeChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(d => d.month),
                    datasets: [
                        {
                            label: 'Vendas (Feiras + Recibos)',
                            data: data.map(d => d.revenue),
                            backgroundColor: 'rgba(34, 197, 94, 0.7)',
                            borderColor: 'rgb(34, 197, 94)',
                            borderWidth: 2
                        },
                        {
                            label: 'Compras (Fichas)',
                            data: data.map(d => d.purchases),
                            backgroundColor: 'rgba(239, 68, 68, 0.7)',
                            borderColor: 'rgb(239, 68, 68)',
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += formatCurrency(context.parsed.y);
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        }

        // Preencher filtro de meses
        function populateMonthFilter() {
            const select = document.getElementById('monthFilter');
            const now = new Date();
            
            // Gerar últimos 12 meses
            for (let i = 0; i < 12; i++) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const value = \`\${year}-\${month}\`;
                const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                
                const option = document.createElement('option');
                option.value = value;
                option.textContent = label.charAt(0).toUpperCase() + label.slice(1);
                
                if (i === 0) option.selected = true;
                
                select.appendChild(option);
            }
        }

        // Event listeners
        document.getElementById('monthFilter').addEventListener('change', loadDashboard);

        // Inicializar
        populateMonthFilter();
        loadDashboard();
    </script>
</body>
</html>`;
