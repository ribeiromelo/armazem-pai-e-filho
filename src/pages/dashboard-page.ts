export const dashboardPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Armazém Pai e Filho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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
                <a href="/dashboard" class="flex items-center px-6 py-3 bg-blue-700 border-l-4 border-white">
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
                <a href="/financeiro" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                    <i class="fas fa-chart-line mr-3"></i>
                    Financeiro
                </a>
                <a href="/usuarios" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors" id="usersMenu">
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
        <main class="flex-1 overflow-y-auto w-full">
            <!-- Header -->
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="px-4 md:px-8 py-4 flex items-center">
                    <!-- Botão Menu Mobile -->
                    <button onclick="toggleSidebar()" class="md:hidden mr-4 text-gray-600 hover:text-gray-800">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                    
                    <div>
                        <h2 class="text-xl md:text-2xl font-semibold text-gray-800">Dashboard</h2>
                        <p class="text-gray-600 text-xs md:text-sm mt-1">Visão geral do sistema</p>
                    </div>
                </div>
            </header>

            <!-- Content -->
            <div class="p-4 md:p-8">
                <!-- Cards de Resumo -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    <!-- Card Dinheiro -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
                            </div>
                            <span class="text-sm text-gray-500">Este mês</span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800" id="totalCash">R$ 0,00</h3>
                        <p class="text-sm text-gray-600 mt-1">Total em Dinheiro</p>
                    </div>

                    <!-- Card Fiado -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-hand-holding-usd text-yellow-600 text-xl"></i>
                            </div>
                            <span class="text-sm text-gray-500">Este mês</span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800" id="totalCredit">R$ 0,00</h3>
                        <p class="text-sm text-gray-600 mt-1">Total Fiado</p>
                    </div>

                    <!-- Card Estoque -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-boxes text-blue-600 text-xl"></i>
                            </div>
                            <span class="text-sm text-gray-500">Atual</span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800" id="totalStock">0</h3>
                        <p class="text-sm text-gray-600 mt-1">Itens em Estoque</p>
                    </div>

                    <!-- Card Total -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-chart-pie text-purple-600 text-xl"></i>
                            </div>
                            <span class="text-sm text-gray-500">Geral</span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800" id="totalGeneral">R$ 0,00</h3>
                        <p class="text-sm text-gray-600 mt-1">Total Geral</p>
                    </div>
                </div>

                <!-- Ações Rápidas -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                    <!-- Ações -->
                    <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
                        <div class="grid grid-cols-2 gap-3 md:gap-4">
                            <a href="/fichas?action=new" class="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                <i class="fas fa-plus-circle text-blue-600 text-2xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Nova Ficha</span>
                            </a>
                            <a href="/feiras?action=new" class="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                <i class="fas fa-store text-green-600 text-2xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Nova Feira</span>
                            </a>
                            <a href="/recibos?action=new" class="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                <i class="fas fa-file-invoice-dollar text-purple-600 text-2xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Gerar Recibo</span>
                            </a>
                            <a href="/fornecedores?action=new" class="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                                <i class="fas fa-user-plus text-yellow-600 text-2xl mb-2"></i>
                                <span class="text-sm font-medium text-gray-700">Novo Fornecedor</span>
                            </a>
                        </div>
                    </div>

                    <!-- Últimas Fichas -->
                    <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-800">Últimas Fichas</h3>
                            <a href="/fichas" class="text-sm text-blue-600 hover:text-blue-700">Ver todas →</a>
                        </div>
                        <div class="space-y-3" id="recentSheets">
                            <p class="text-gray-500 text-sm">Carregando...</p>
                        </div>
                    </div>
                </div>

                <!-- Tabela de Fornecedores Ativos -->
                <div class="bg-white rounded-lg shadow-sm">
                    <div class="p-4 md:p-6 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-800">Fornecedores Ativos</h3>
                            <a href="/fornecedores" class="text-sm text-blue-600 hover:text-blue-700">Ver todos →</a>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[600px]">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fornecedor
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Produto
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200" id="suppliersTable">
                                <tr>
                                    <td colspan="4" class="px-6 py-4 text-center text-gray-500">
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

        // Função de logout
        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }

        // Carregar dados do dashboard
        async function loadDashboardData() {
            try {
                const response = await fetch('/api/dashboard', {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Atualizar cards
                    document.getElementById('totalCash').textContent = \`R$ \${data.totalCash.toFixed(2).replace('.', ',')}\`;
                    document.getElementById('totalCredit').textContent = \`R$ \${data.totalCredit.toFixed(2).replace('.', ',')}\`;
                    document.getElementById('totalStock').textContent = data.totalStock;
                    document.getElementById('totalGeneral').textContent = \`R$ \${data.totalGeneral.toFixed(2).replace('.', ',')}\`;
                    
                    // Atualizar últimas fichas
                    const sheetsHtml = data.recentSheets.map(sheet => \`
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p class="font-medium text-gray-800">\${sheet.supplier_name}</p>
                                <p class="text-sm text-gray-500">\${new Date(sheet.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <span class="text-sm font-semibold text-blue-600">R$ \${sheet.folder_total.toFixed(2).replace('.', ',')}</span>
                        </div>
                    \`).join('');
                    
                    document.getElementById('recentSheets').innerHTML = sheetsHtml || '<p class="text-gray-500 text-sm">Nenhuma ficha encontrada</p>';
                    
                    // Atualizar tabela de fornecedores
                    const suppliersHtml = data.activeSuppliers.map(supplier => \`
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">\${supplier.name}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">\${supplier.product_type}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Ativo
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="/fichas?supplier=\${supplier.id}" class="text-blue-600 hover:text-blue-900">Ver fichas</a>
                            </td>
                        </tr>
                    \`).join('');
                    
                    document.getElementById('suppliersTable').innerHTML = suppliersHtml || \`
                        <tr>
                            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                                Nenhum fornecedor ativo
                            </td>
                        </tr>
                    \`;
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        }

        // Toggle sidebar mobile
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        // Carregar dados ao iniciar
        loadDashboardData();
    </script>
</body>
</html>`;