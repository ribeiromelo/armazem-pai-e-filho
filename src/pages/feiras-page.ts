export const feirasPage = `
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feiras - Armazém Pai e Filho</title>
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
        
        @media print {
            .no-print { display: none !important; }
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
                <a href="/feiras" class="flex items-center px-6 py-3 bg-blue-700 border-l-4 border-white">
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
                <a href="/usuarios" id="usersMenu" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
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
                            <h2 class="text-xl md:text-2xl font-semibold text-gray-800">Feiras</h2>
                            <p class="text-gray-600 text-xs md:text-sm mt-1 hidden sm:block">Registre e controle suas vendas em feiras</p>
                        </div>
                    </div>
                    <button 
                        onclick="openModal()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg flex items-center text-sm md:text-base"
                        id="btnAddFair"
                    >
                        <i class="fas fa-plus mr-1 md:mr-2"></i>
                        <span class="hidden sm:inline">Nova</span>
                        <span class="hidden md:inline"> Feira</span>
                    </button>
                </div>
            </header>

            <!-- Content -->
            <div class="p-4 md:p-8">
                <!-- Filtros -->
                <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
                    <h3 class="text-lg font-semibold mb-4">Filtros</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Mês</label>
                            <select id="monthFilter" onchange="loadFairs()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Todos os meses</option>
                                <option value="01">Janeiro</option>
                                <option value="02">Fevereiro</option>
                                <option value="03">Março</option>
                                <option value="04">Abril</option>
                                <option value="05">Maio</option>
                                <option value="06">Junho</option>
                                <option value="07">Julho</option>
                                <option value="08">Agosto</option>
                                <option value="09">Setembro</option>
                                <option value="10">Outubro</option>
                                <option value="11">Novembro</option>
                                <option value="12">Dezembro</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                            <select id="yearFilter" onchange="loadFairs()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Todos os anos</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button onclick="clearFilters()" class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                                <i class="fas fa-undo mr-2"></i>Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Cards de Estatísticas -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 mb-1">Total de Feiras</p>
                                <p class="text-2xl font-bold text-blue-600" id="totalFairs">0</p>
                            </div>
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-store text-blue-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 mb-1">Faturamento Total</p>
                                <p class="text-2xl font-bold text-green-600" id="totalRevenue">R$ 0,00</p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 mb-1">Média por Feira</p>
                                <p class="text-2xl font-bold text-purple-600" id="avgRevenue">R$ 0,00</p>
                            </div>
                            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-chart-line text-purple-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-600 mb-1">Melhor Feira</p>
                                <p class="text-2xl font-bold text-orange-600" id="maxRevenue">R$ 0,00</p>
                            </div>
                            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-trophy text-orange-600 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabela de Feiras -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Local
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Itens
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor Total
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Criada por
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200" id="fairsTable">
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

    <!-- Modal Adicionar/Editar -->
    <div id="fairModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-4 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-semibold mb-4" id="modalTitle">Nova Feira</h3>
            <form id="fairForm">
                <input type="hidden" id="fairId">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Data da Feira *</label>
                        <input type="date" id="fairDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Local *</label>
                        <input type="text" id="location" required placeholder="Ex: Feira da Maraponga" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                <!-- Itens da Feira -->
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-3">
                        <label class="block text-sm font-medium text-gray-700">Itens Levados *</label>
                        <button type="button" onclick="addFairItem()" class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                            <i class="fas fa-plus mr-1"></i>Adicionar Item
                        </button>
                    </div>
                    <div id="fairItemsContainer" class="space-y-3">
                        <!-- Itens serão adicionados aqui -->
                    </div>
                </div>

                <!-- Preview do Total -->
                <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-gray-700">Total da Feira:</span>
                        <span class="text-2xl font-bold text-blue-600" id="previewTotal">R$ 0,00</span>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                    <textarea id="observations" rows="3" placeholder="Observações sobre a feira..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                
                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal de Visualização -->
    <div id="viewModal" class="modal">
        <div class="modal-content p-8">
            <div class="flex justify-between items-start mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Visualizar Feira</h2>
                <button onclick="closeViewModal()" class="text-gray-400 hover:text-gray-600 no-print">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            
            <div id="viewContent" class="space-y-4">
                <!-- Conteúdo será inserido dinamicamente -->
            </div>
            
            <div class="flex justify-end mt-6">
                <button onclick="closeViewModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Fechar
                </button>
            </div>
        </div>
    </div>

    <!-- Modal de Finalização -->
    <div id="finalizeModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-4 md:p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-semibold mb-4">Finalizar Feira</h3>
            <p class="text-sm text-gray-600 mb-6">Informe a quantidade que voltou e o preço de compra de cada item para calcular o lucro.</p>
            
            <form id="finalizeForm">
                <input type="hidden" id="finalizeFairId">
                
                <!-- Cabeçalho da tabela -->
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qtd Levada</th>
                                <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Preço Venda</th>
                                <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qtd Voltou</th>
                                <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qtd Vendida</th>
                                <th class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Preço Compra</th>
                                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Faturamento</th>
                                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Custo</th>
                                <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Lucro</th>
                            </tr>
                        </thead>
                        <tbody id="finalizeItemsContainer" class="bg-white divide-y divide-gray-200">
                            <!-- Itens serão adicionados aqui -->
                        </tbody>
                    </table>
                </div>
                
                <!-- Totais -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <div class="text-sm text-gray-600 mb-1">Faturamento Total</div>
                        <div class="text-2xl font-bold text-blue-600" id="totalRevenue">R$ 0,00</div>
                    </div>
                    <div class="p-4 bg-orange-50 rounded-lg">
                        <div class="text-sm text-gray-600 mb-1">Custo Total</div>
                        <div class="text-2xl font-bold text-orange-600" id="totalCost">R$ 0,00</div>
                    </div>
                    <div class="p-4 bg-green-50 rounded-lg">
                        <div class="text-sm text-gray-600 mb-1">Lucro Total</div>
                        <div class="text-2xl font-bold text-green-600" id="totalProfit">R$ 0,00</div>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                    <button type="button" onclick="closeFinalizeModal()" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <i class="fas fa-check mr-2"></i>Finalizar Feira
                    </button>
                </div>
            </form>
        </div>
    </div>


    <!-- JavaScript externo -->
    <script src="/static/feiras.js" defer></script>
</body>
</html>
`;
