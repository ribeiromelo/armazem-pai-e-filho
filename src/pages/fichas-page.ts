export const fichasPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fichas Semanais - Armazém Pai e Filho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
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
                <a href="/fichas" class="flex items-center px-6 py-3 bg-blue-700 border-l-4 border-white">
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
                <div class="px-4 md:px-8 py-4 flex justify-between items-center">
                    <div class="flex items-center flex-1">
                        <!-- Botão Menu Mobile -->
                        <button onclick="toggleSidebar()" class="md:hidden mr-3 text-gray-600 hover:text-gray-800">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                        
                        <div>
                            <h2 class="text-xl md:text-2xl font-semibold text-gray-800">Fichas Semanais</h2>
                            <p class="text-gray-600 text-xs md:text-sm mt-1 hidden sm:block">Controle de fichas dos fornecedores</p>
                        </div>
                    </div>
                    <button onclick="openAddModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg flex items-center text-sm md:text-base">
                        <i class="fas fa-plus mr-1 md:mr-2"></i>
                        <span class="hidden sm:inline">Nova</span>
                        <span class="hidden md:inline"> Ficha</span>
                    </button>
                </div>
            </header>

            <!-- Content -->
            <div class="p-4 md:p-8">
                <!-- Cards de Resumo -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-4 md:mb-6">
                    <div class="bg-white rounded-lg shadow-sm p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-500">Total de Fichas</p>
                                <p class="text-2xl font-bold text-gray-800" id="totalSheets">0</p>
                            </div>
                            <i class="fas fa-file-alt text-blue-500 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-500">Total Fiado</p>
                                <p class="text-xl font-bold text-gray-800" id="totalCredit">R$ 0,00</p>
                            </div>
                            <i class="fas fa-hand-holding-usd text-yellow-500 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-500">Total Dinheiro</p>
                                <p class="text-xl font-bold text-gray-800" id="totalCash">R$ 0,00</p>
                            </div>
                            <i class="fas fa-money-bill-wave text-green-500 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-500">Total Estoque</p>
                                <p class="text-xl font-bold text-gray-800" id="totalStock">R$ 0,00</p>
                            </div>
                            <i class="fas fa-boxes text-orange-500 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-500">Total Geral</p>
                                <p class="text-xl font-bold text-gray-800" id="totalGeneral">R$ 0,00</p>
                            </div>
                            <i class="fas fa-calculator text-purple-500 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-500">Conferidas</p>
                                <p class="text-2xl font-bold text-gray-800" id="checkedPercentage">0%</p>
                            </div>
                            <i class="fas fa-check-double text-teal-500 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <!-- Filtros -->
                <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fornecedor</label>
                            <select id="supplierFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Todos</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Mês</label>
                            <input type="month" id="monthFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Conferidas</label>
                            <select id="checkedFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Todas</option>
                                <option value="true">Sim</option>
                                <option value="false">Não</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Tabela -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[800px]">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fornecedor
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estoque
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fiado
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dinheiro
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Conferida
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200" id="sheetsTable">
                            <tr>
                                <td colspan="8" class="px-6 py-4 text-center text-gray-500">
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
    <div id="sheetModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-4 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-semibold mb-4" id="modalTitle">Nova Ficha</h3>
            <form id="sheetForm">
                <input type="hidden" id="sheetId">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fornecedor*</label>
                        <select id="supplierId" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Selecione...</option>
                        </select>
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Data*</label>
                        <input type="date" id="sheetDate" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                </div>
                
                <!-- Seção de Itens em Estoque -->
                <div class="mb-6 border border-gray-200 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-800 mb-3">Mercadoria em Estoque</h4>
                    <div id="stockItemsContainer">
                        <!-- Itens serão adicionados aqui dinamicamente -->
                    </div>
                    <button type="button" onclick="addStockItem()" class="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <i class="fas fa-plus mr-1"></i> Adicionar mais itens
                    </button>
                    <div class="mt-3 bg-blue-50 p-3 rounded">
                        <p class="text-sm font-semibold text-blue-900">Total do Estoque: <span id="stockTotalPreview">R$ 0,00</span></p>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Fiado (Digite os valores, serão extraídos automaticamente)
                    </label>
                    <textarea id="creditText" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: R$2000 Francisco Croatá, R$500 José"></textarea>
                    <p class="text-sm text-gray-500 mt-1">Total Fiado: <span id="creditPreview" class="font-semibold">R$ 0,00</span></p>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Dinheiro no Envelope</label>
                    <input type="number" id="envelopeMoney" step="0.01" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                    <textarea id="observations" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: +500 (adiciona ao total) ou -200 (subtrai do total)"></textarea>
                    <p class="text-xs text-gray-500 mt-1">
                        <i class="fas fa-info-circle mr-1"></i>
                        Use <strong>+valor</strong> para somar ao total da pasta ou <strong>-valor</strong> para subtrair. 
                        Valores sem + ou - não serão considerados no cálculo.
                    </p>
                    <p class="text-sm text-gray-600 mt-1">Ajuste das observações: <span id="observationsAdjustmentPreview" class="font-semibold">R$ 0,00</span></p>
                </div>
                
                <div class="mb-4">
                    <label class="flex items-center">
                        <input type="checkbox" id="doubleChecked" class="mr-2">
                        <span class="text-sm font-medium text-gray-700">Conferido duas vezes</span>
                    </label>
                </div>
                
                <div class="bg-blue-50 p-4 rounded-lg mb-4">
                    <p class="text-lg font-semibold text-blue-900">Total da Pasta: <span id="totalPreview">R$ 0,00</span></p>
                    <p class="text-xs text-blue-700 mt-1">(Estoque + Fiado + Dinheiro + Ajustes das Observações)</p>
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
                <h2 class="text-2xl font-bold text-gray-800">Visualizar Ficha</h2>
                <button onclick="closeViewModal()" class="text-gray-400 hover:text-gray-600 no-print">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            
            <div id="viewContent" class="space-y-4">
                <!-- Conteúdo será inserido dinamicamente -->
            </div>
            
            <div class="flex justify-end space-x-3 mt-6 no-print">
                <button onclick="printSheet()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                    <i class="fas fa-print mr-2"></i>
                    Imprimir
                </button>
                <button onclick="closeViewModal()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    Fechar
                </button>
            </div>
        </div>
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

        let sheets = [];
        let suppliers = [];
        let stockItemCounter = 0;

        // Função para extrair valores do texto de fiado (CORRIGIDA)
        function extractCreditValues(text) {
            if (!text) return 0;
            
            // Regex melhorada - procura por números que podem estar precedidos por R$
            const regex = /(?:R\\$\\s*)?([0-9]+(?:[.,]?[0-9]{3})*(?:[.,][0-9]{1,2})?)/gi;
            let total = 0;
            let match;
            
            while ((match = regex.exec(text)) !== null) {
                let value = match[1]
                    .replace(/\\./g, '') // Remover pontos de milhar
                    .replace(',', '.'); // Trocar vírgula por ponto
                
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    total += numValue;
                }
            }
            
            return total;
        }

        // Função para extrair ajustes das observações
        function extractObservationsAdjustment(text) {
            if (!text) return 0;
            
            const regex = /([+-])\\s*(?:R\\$\\s*)?([0-9]+(?:[.,]?[0-9]{3})*(?:[.,][0-9]{1,2})?)/gi;
            let adjustment = 0;
            let match;
            
            while ((match = regex.exec(text)) !== null) {
                const sign = match[1];
                let value = match[2]
                    .replace(/\\./g, '')
                    .replace(',', '.');
                
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    adjustment += sign === '+' ? numValue : -numValue;
                }
            }
            
            return adjustment;
        }

        // Adicionar item de estoque
        function addStockItem(data = null) {
            const itemId = stockItemCounter++;
            const itemHtml = \`
                <div class="stock-item grid grid-cols-12 gap-2 mb-2" data-item-id="\${itemId}">
                    <div class="col-span-2">
                        <input type="number" 
                               class="stock-quantity w-full px-3 py-2 border border-gray-300 rounded-lg" 
                               placeholder="Qtd" 
                               min="0" 
                               value="\${data?.quantity || ''}"
                               onchange="updateStockTotal()">
                    </div>
                    <div class="col-span-5">
                        <input type="text" 
                               class="stock-item-name w-full px-3 py-2 border border-gray-300 rounded-lg" 
                               placeholder="Nome do item (Ex: Rapadura)" 
                               value="\${data?.item_name || ''}">
                    </div>
                    <div class="col-span-3">
                        <input type="number" 
                               class="stock-unit-value w-full px-3 py-2 border border-gray-300 rounded-lg" 
                               placeholder="Valor unit." 
                               min="0" 
                               step="0.01" 
                               value="\${data?.unit_value || ''}"
                               onchange="updateStockTotal()">
                    </div>
                    <div class="col-span-2 flex items-center">
                        <span class="stock-item-total text-sm font-semibold mr-2">R$ 0,00</span>
                        <button type="button" onclick="removeStockItem(\${itemId})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            \`;
            
            document.getElementById('stockItemsContainer').insertAdjacentHTML('beforeend', itemHtml);
            updateStockTotal();
        }

        // Remover item de estoque
        function removeStockItem(itemId) {
            const item = document.querySelector(\`[data-item-id="\${itemId}"]\`);
            if (item) {
                item.remove();
                updateStockTotal();
            }
        }

        // Atualizar total do estoque
        function updateStockTotal() {
            let total = 0;
            const items = document.querySelectorAll('.stock-item');
            
            items.forEach(item => {
                const quantity = parseFloat(item.querySelector('.stock-quantity').value) || 0;
                const unitValue = parseFloat(item.querySelector('.stock-unit-value').value) || 0;
                const itemTotal = quantity * unitValue;
                
                item.querySelector('.stock-item-total').textContent = \`R$ \${itemTotal.toFixed(2).replace('.', ',')}\`;
                total += itemTotal;
            });
            
            document.getElementById('stockTotalPreview').textContent = \`R$ \${total.toFixed(2).replace('.', ',')}\`;
            updatePreview();
        }

        // Atualizar preview dos valores
        function updatePreview() {
            const creditText = document.getElementById('creditText').value;
            const envelopeMoney = parseFloat(document.getElementById('envelopeMoney').value) || 0;
            const observations = document.getElementById('observations').value;
            
            // Obter total do estoque
            let stockTotal = 0;
            const items = document.querySelectorAll('.stock-item');
            items.forEach(item => {
                const quantity = parseFloat(item.querySelector('.stock-quantity').value) || 0;
                const unitValue = parseFloat(item.querySelector('.stock-unit-value').value) || 0;
                stockTotal += quantity * unitValue;
            });
            
            const creditTotal = extractCreditValues(creditText);
            const observationsAdjustment = extractObservationsAdjustment(observations);
            const total = stockTotal + creditTotal + envelopeMoney + observationsAdjustment;
            
            document.getElementById('creditPreview').textContent = \`R$ \${creditTotal.toFixed(2).replace('.', ',')}\`;
            document.getElementById('observationsAdjustmentPreview').textContent = 
                observationsAdjustment >= 0 
                    ? \`+R$ \${observationsAdjustment.toFixed(2).replace('.', ',')}\`
                    : \`-R$ \${Math.abs(observationsAdjustment).toFixed(2).replace('.', ',')}\`;
            document.getElementById('totalPreview').textContent = \`R$ \${total.toFixed(2).replace('.', ',')}\`;
        }

        // Event listeners para atualizar preview
        document.getElementById('creditText').addEventListener('input', updatePreview);
        document.getElementById('envelopeMoney').addEventListener('input', updatePreview);
        document.getElementById('observations').addEventListener('input', updatePreview);

        // Carregar fornecedores
        async function loadSuppliers() {
            try {
                const response = await fetch('/api/suppliers', {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    suppliers = await response.json();
                    
                    // Preencher selects
                    const supplierSelect = document.getElementById('supplierId');
                    const filterSelect = document.getElementById('supplierFilter');
                    
                    supplierSelect.innerHTML = '<option value="">Selecione...</option>';
                    filterSelect.innerHTML = '<option value="">Todos</option>';
                    
                    suppliers.forEach(supplier => {
                        supplierSelect.innerHTML += \`<option value="\${supplier.id}">\${supplier.name} - \${supplier.product_type}</option>\`;
                        filterSelect.innerHTML += \`<option value="\${supplier.id}">\${supplier.name}</option>\`;
                    });
                }
            } catch (error) {
                console.error('Erro ao carregar fornecedores:', error);
            }
        }

        // Carregar fichas
        async function loadSheets() {
            try {
                const supplierId = document.getElementById('supplierFilter').value;
                const month = document.getElementById('monthFilter').value;
                
                let url = '/api/sheets?';
                if (supplierId) url += \`supplier_id=\${supplierId}&\`;
                if (month) url += \`month=\${month}&\`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    sheets = await response.json();
                    renderSheets();
                    loadStats();
                }
            } catch (error) {
                console.error('Erro ao carregar fichas:', error);
            }
        }

        // Carregar estatísticas
        async function loadStats() {
            try {
                const supplierId = document.getElementById('supplierFilter').value;
                const month = document.getElementById('monthFilter').value;
                
                let url = '/api/sheets/stats/summary?';
                if (supplierId) url += \`supplier_id=\${supplierId}&\`;
                if (month) url += \`month=\${month}&\`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    const stats = await response.json();
                    
                    document.getElementById('totalSheets').textContent = stats.total_sheets;
                    document.getElementById('totalCredit').textContent = \`R$ \${stats.total_credit.toFixed(2).replace('.', ',')}\`;
                    document.getElementById('totalCash').textContent = \`R$ \${stats.total_cash.toFixed(2).replace('.', ',')}\`;
                    document.getElementById('totalStock').textContent = \`R$ \${stats.total_stock.toFixed(2).replace('.', ',')}\`;
                    document.getElementById('totalGeneral').textContent = \`R$ \${stats.total_general.toFixed(2).replace('.', ',')}\`;
                    document.getElementById('checkedPercentage').textContent = \`\${stats.checked_percentage}%\`;
                }
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            }
        }

        // Renderizar tabela
        function renderSheets() {
            const checkedFilter = document.getElementById('checkedFilter').value;
            
            const filtered = sheets.filter(s => {
                if (checkedFilter === '') return true;
                const isChecked = s.double_checked ? 'true' : 'false';
                return isChecked === checkedFilter;
            });

            const html = filtered.map(sheet => {
                // Formatar data no padrão brasileiro com horário de Fortaleza
                const date = new Date(sheet.date + 'T00:00:00-03:00');
                const formattedDate = date.toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    timeZone: 'America/Fortaleza'
                });
                
                return \`
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${formattedDate}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">\${sheet.supplier_name}</div>
                        <div class="text-xs text-gray-500">\${sheet.product_type}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">R$ \${(sheet.stock_total || 0).toFixed(2).replace('.', ',')}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">R$ \${sheet.credit_total.toFixed(2).replace('.', ',')}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">R$ \${sheet.envelope_money.toFixed(2).replace('.', ',')}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-semibold text-blue-600">R$ \${sheet.folder_total.toFixed(2).replace('.', ',')}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        \${sheet.double_checked 
                            ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"><i class="fas fa-check mr-1"></i>Sim</span>'
                            : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Não</span>'
                        }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="viewSheet(\${sheet.id})" class="text-blue-600 hover:text-blue-900 mr-2">
                            <i class="fas fa-eye"></i>
                        </button>
                        \${user.permission !== 'view' ? \`
                            <button onclick="editSheet(\${sheet.id})" class="text-yellow-600 hover:text-yellow-900 mr-2">
                                <i class="fas fa-edit"></i>
                            </button>
                        \` : ''}
                        \${user.permission === 'admin' ? \`
                            <button onclick="deleteSheet(\${sheet.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i>
                            </button>
                        \` : ''}
                    </td>
                </tr>
            \`;
            }).join('');
            
            document.getElementById('sheetsTable').innerHTML = html || \`
                <tr>
                    <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                        Nenhuma ficha encontrada
                    </td>
                </tr>
            \`;
        }

        // Event listeners para filtros
        document.getElementById('supplierFilter').addEventListener('change', loadSheets);
        document.getElementById('monthFilter').addEventListener('change', loadSheets);
        document.getElementById('checkedFilter').addEventListener('change', renderSheets);

        // Modal functions
        function openAddModal() {
            document.getElementById('modalTitle').textContent = 'Nova Ficha';
            document.getElementById('sheetForm').reset();
            document.getElementById('sheetId').value = '';
            document.getElementById('stockItemsContainer').innerHTML = '';
            stockItemCounter = 0;
            addStockItem(); // Adicionar um item inicial
            updatePreview();
            document.getElementById('sheetModal').classList.remove('hidden');
        }

        function viewSheet(id) {
            const sheet = sheets.find(s => s.id === id);
            if (sheet) {
                // Formatar data no padrão brasileiro com horário de Fortaleza
                const date = new Date(sheet.date + 'T00:00:00-03:00');
                const formattedDate = date.toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    timeZone: 'America/Fortaleza'
                });
                
                // Criar HTML detalhado para visualização
                const stockItemsHtml = sheet.stock_items && sheet.stock_items.length > 0
                    ? sheet.stock_items.map(item => \`
                        <tr>
                            <td class="border px-3 py-2">\${item.quantity}</td>
                            <td class="border px-3 py-2">\${item.item_name}</td>
                            <td class="border px-3 py-2 text-right">R$ \${item.unit_value.toFixed(2).replace('.', ',')}</td>
                            <td class="border px-3 py-2 text-right font-semibold">R$ \${item.total_value.toFixed(2).replace('.', ',')}</td>
                        </tr>
                    \`).join('')
                    : '<tr><td colspan="4" class="border px-3 py-2 text-center text-gray-500">Nenhum item cadastrado</td></tr>';
                
                const viewContent = \`
                    <div class="space-y-6" id="sheetToPrint">
                        <!-- Cabeçalho -->
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="text-xl font-bold text-blue-800">Ficha #\${sheet.id}</h3>
                                    <p class="text-gray-600 mt-1">Data: \${formattedDate}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-gray-600">Criada por:</p>
                                    <p class="font-semibold">\${sheet.created_by_name}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Informações do Fornecedor -->
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-700 mb-2">Fornecedor</h4>
                            <p class="text-lg">\${sheet.supplier_name}</p>
                            <p class="text-sm text-gray-600 mt-1">Produto: \${sheet.product_type}</p>
                        </div>
                        
                        <!-- Tabela de Estoque -->
                        <div>
                            <h4 class="font-semibold text-gray-700 mb-2">Itens do Estoque</h4>
                            <table class="min-w-full border-collapse border">
                                <thead class="bg-gray-100">
                                    <tr>
                                        <th class="border px-3 py-2 text-left">Qtd</th>
                                        <th class="border px-3 py-2 text-left">Item</th>
                                        <th class="border px-3 py-2 text-right">Valor Unit.</th>
                                        <th class="border px-3 py-2 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${stockItemsHtml}
                                </tbody>
                                <tfoot class="bg-gray-100">
                                    <tr>
                                        <td colspan="3" class="border px-3 py-2 text-right font-semibold">Total do Estoque:</td>
                                        <td class="border px-3 py-2 text-right font-bold text-blue-600">
                                            R$ \${(sheet.stock_total || 0).toFixed(2).replace('.', ',')}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        <!-- Informações Financeiras -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-yellow-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-700 mb-2">Fiado</h4>
                                <p class="text-sm text-gray-600 mb-1">\${sheet.credit_text || 'Nenhum registro'}</p>
                                <p class="text-lg font-bold text-yellow-600">R$ \${sheet.credit_total.toFixed(2).replace('.', ',')}</p>
                            </div>
                            
                            <div class="bg-green-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-700 mb-2">Dinheiro do Envelope</h4>
                                <p class="text-lg font-bold text-green-600">R$ \${sheet.envelope_money.toFixed(2).replace('.', ',')}</p>
                            </div>
                        </div>
                        
                        <!-- Observações e Ajustes -->
                        \${sheet.observations ? \`
                        <div class="bg-orange-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-700 mb-2">Observações</h4>
                            <p class="text-gray-700">\${sheet.observations}</p>
                            \${sheet.observations_adjustment !== 0 ? \`
                                <p class="mt-2 font-semibold text-orange-600">
                                    Ajuste: \${sheet.observations_adjustment > 0 ? '+' : ''}R$ \${sheet.observations_adjustment.toFixed(2).replace('.', ',')}
                                </p>
                            \` : ''}
                        </div>
                        \` : ''}
                        
                        <!-- Total da Pasta -->
                        <div class="bg-blue-100 p-6 rounded-lg">
                            <div class="flex justify-between items-center">
                                <h4 class="text-lg font-bold text-blue-800">Total da Pasta</h4>
                                <p class="text-2xl font-bold text-blue-600">R$ \${sheet.folder_total.toFixed(2).replace('.', ',')}</p>
                            </div>
                        </div>
                        
                        <!-- Status de Conferência -->
                        <div class="flex items-center justify-center p-4 \${sheet.double_checked ? 'bg-green-100' : 'bg-red-100'} rounded-lg">
                            <i class="fas \${sheet.double_checked ? 'fa-check-double' : 'fa-exclamation-triangle'} mr-2 \${sheet.double_checked ? 'text-green-600' : 'text-red-600'}"></i>
                            <span class="font-semibold \${sheet.double_checked ? 'text-green-800' : 'text-red-800'}">
                                \${sheet.double_checked ? 'Conferida 2x' : 'Não conferida 2x'}
                            </span>
                        </div>
                    </div>
                \`;
                
                // Inserir conteúdo no modal
                document.getElementById('viewContent').innerHTML = viewContent;
                
                // Exibir modal
                document.getElementById('viewModal').classList.add('active');
            }
        }
        
        function closeViewModal() {
            document.getElementById('viewModal').classList.remove('active');
        }
        
        function printSheet() {
            const element = document.getElementById('sheetToPrint');
            
            html2canvas(element, {
                scale: 2,
                logging: false,
                useCORS: true
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const windowContent = '<!DOCTYPE html>' +
                    '<html>' +
                    '<head><title>Imprimir Ficha</title></head>' +
                    '<body style="margin: 0; padding: 20px;">' +
                    '<img src="' + imgData + '" style="width: 100%; max-width: 800px; display: block; margin: 0 auto;">' +
                    '<script>window.onload = function() { window.print(); window.close(); }</' + 'script>' +
                    '</body>' +
                    '</html>';
                
                const printWindow = window.open('', '', 'width=900,height=650');
                printWindow.document.open();
                printWindow.document.write(windowContent);
                printWindow.document.close();
            });
        }

        function editSheet(id) {
            const sheet = sheets.find(s => s.id === id);
            if (sheet) {
                document.getElementById('modalTitle').textContent = 'Editar Ficha';
                document.getElementById('sheetId').value = sheet.id;
                document.getElementById('supplierId').value = sheet.supplier_id;
                document.getElementById('sheetDate').value = sheet.date;
                document.getElementById('creditText').value = sheet.credit_text || '';
                document.getElementById('envelopeMoney').value = sheet.envelope_money || 0;
                document.getElementById('observations').value = sheet.observations || '';
                document.getElementById('doubleChecked').checked = sheet.double_checked;
                
                // Limpar e adicionar itens de estoque
                document.getElementById('stockItemsContainer').innerHTML = '';
                stockItemCounter = 0;
                
                if (sheet.stock_items && sheet.stock_items.length > 0) {
                    sheet.stock_items.forEach(item => {
                        addStockItem(item);
                    });
                } else {
                    addStockItem(); // Adicionar um item vazio
                }
                
                updatePreview();
                document.getElementById('sheetModal').classList.remove('hidden');
            }
        }

        function closeModal() {
            document.getElementById('sheetModal').classList.add('hidden');
        }

        // Form submit
        document.getElementById('sheetForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('sheetId').value;
            
            // Coletar itens de estoque
            const stockItems = [];
            const items = document.querySelectorAll('.stock-item');
            items.forEach(item => {
                const quantity = parseFloat(item.querySelector('.stock-quantity').value) || 0;
                const itemName = item.querySelector('.stock-item-name').value;
                const unitValue = parseFloat(item.querySelector('.stock-unit-value').value) || 0;
                
                if (quantity > 0 && itemName && unitValue > 0) {
                    stockItems.push({
                        quantity: quantity,
                        item_name: itemName,
                        unit_value: unitValue
                    });
                }
            });
            
            const data = {
                supplier_id: parseInt(document.getElementById('supplierId').value),
                date: document.getElementById('sheetDate').value,
                credit_text: document.getElementById('creditText').value,
                envelope_money: parseFloat(document.getElementById('envelopeMoney').value) || 0,
                observations: document.getElementById('observations').value,
                double_checked: document.getElementById('doubleChecked').checked,
                stock_items: stockItems
            };
            
            try {
                const response = await fetch(id ? \`/api/sheets/\${id}\` : '/api/sheets', {
                    method: id ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${token}\`
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    closeModal();
                    loadSheets();
                } else {
                    const error = await response.json();
                    alert(error.error || 'Erro ao salvar ficha');
                }
            } catch (error) {
                alert('Erro ao salvar ficha');
            }
        });

        async function deleteSheet(id) {
            if (!confirm('Tem certeza que deseja excluir esta ficha?')) return;
            
            try {
                const response = await fetch(\`/api/sheets/\${id}\`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    loadSheets();
                }
            } catch (error) {
                alert('Erro ao excluir ficha');
            }
        }

        // Definir mês atual no filtro
        const now = new Date();
        document.getElementById('monthFilter').value = now.toISOString().slice(0, 7);

        // Toggle sidebar mobile
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        // Carregar dados ao iniciar
        loadSuppliers();
        loadSheets();
    </script>
</body>
</html>`;