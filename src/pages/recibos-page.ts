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

    <!-- Modal de Adicionar/Editar Recibo -->
    <div id="receiptModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-4 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-semibold mb-4" id="modalTitle">Novo Recibo</h3>
            <form id="receiptForm">
                <input type="hidden" id="receiptId">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nº do Recibo *</label>
                        <input type="text" id="receiptNumber" required placeholder="Ex: 001/2024" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Data *</label>
                        <input type="date" id="receiptDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Cliente *</label>
                        <input type="text" id="recipientName" required placeholder="Nome completo" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">CPF (opcional)</label>
                        <input type="text" id="recipientCpf" placeholder="000.000.000-00" maxlength="14" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
                    <select id="paymentMethod" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Pix">Pix</option>
                        <option value="Transferência">Transferência</option>
                        <option value="Cheque">Cheque</option>
                    </select>
                </div>

                <!-- Itens do Recibo -->
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-3">
                        <label class="block text-sm font-medium text-gray-700">Itens do Recibo *</label>
                        <button type="button" onclick="addReceiptItem()" class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                            <i class="fas fa-plus mr-1"></i>Adicionar Item
                        </button>
                    </div>
                    <div id="receiptItemsContainer" class="space-y-3">
                        <!-- Itens serão adicionados aqui -->
                    </div>
                </div>

                <!-- Preview do Total -->
                <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-gray-700">Valor Total:</span>
                        <span class="text-2xl font-bold text-blue-600" id="previewTotal">R$ 0,00</span>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Descrição/Observações</label>
                    <textarea id="description" rows="3" placeholder="Descrição adicional sobre o recibo..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
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

    <!-- Modal de Visualização/Preview -->
    <div id="viewModal" class="modal">
        <div class="modal-content p-4 md:p-8">
            <div class="flex justify-between items-start mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Visualizar Recibo</h2>
                <button onclick="closeViewModal()" class="text-gray-400 hover:text-gray-600 no-print">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            
            <div id="viewContent" class="space-y-4">
                <!-- Conteúdo será inserido dinamicamente -->
            </div>
            
            <div class="flex justify-end space-x-3 mt-6 no-print">
                <button onclick="generatePDF()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                    <i class="fas fa-file-pdf mr-2"></i>
                    Baixar PDF
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
        let receiptItemCounter = 0;
        let currentReceiptForPDF = null;

        // Calcular total em tempo real
        function calculateTotal() {
            const items = document.querySelectorAll('.receipt-item');
            let total = 0;
            
            items.forEach(item => {
                const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
                const unitValue = parseFloat(item.querySelector('.item-unit-value').value) || 0;
                const itemTotal = quantity * unitValue;
                
                item.querySelector('.item-total').textContent = \`R$ \${itemTotal.toFixed(2).replace('.', ',')}\`;
                total += itemTotal;
            });
            
            document.getElementById('previewTotal').textContent = \`R$ \${total.toFixed(2).replace('.', ',')}\`;
        }

        // Adicionar item ao recibo
        function addReceiptItem(data = null) {
            const container = document.getElementById('receiptItemsContainer');
            const itemId = receiptItemCounter++;
            
            const itemHtml = \`
                <div class="receipt-item border border-gray-200 rounded-lg p-4" data-item-id="\${itemId}">
                    <div class="grid grid-cols-12 gap-3 items-end">
                        <div class="col-span-2">
                            <label class="block text-xs text-gray-600 mb-1">Qtd</label>
                            <input type="number" class="item-quantity w-full px-2 py-1 border border-gray-300 rounded text-sm" 
                                   min="1" value="\${data?.quantity || 1}" onchange="calculateTotal()" required>
                        </div>
                        <div class="col-span-6">
                            <label class="block text-xs text-gray-600 mb-1">Descrição</label>
                            <input type="text" class="item-description w-full px-2 py-1 border border-gray-300 rounded text-sm" 
                                   placeholder="Ex: Caixa de tomate" value="\${data?.description || ''}" required>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-xs text-gray-600 mb-1">Valor Unit.</label>
                            <input type="number" class="item-unit-value w-full px-2 py-1 border border-gray-300 rounded text-sm" 
                                   step="0.01" min="0" value="\${data?.unit_value || 0}" onchange="calculateTotal()" required>
                        </div>
                        <div class="col-span-2 flex items-center justify-between">
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Total</label>
                                <div class="item-total font-semibold text-blue-600">R$ 0,00</div>
                            </div>
                            <button type="button" onclick="removeReceiptItem(\${itemId})" class="text-red-600 hover:text-red-800 ml-2">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            \`;
            
            container.insertAdjacentHTML('beforeend', itemHtml);
            calculateTotal();
        }

        // Remover item do recibo
        function removeReceiptItem(itemId) {
            const item = document.querySelector(\`[data-item-id="\${itemId}"]\`);
            if (item) {
                item.remove();
                calculateTotal();
            }
        }

        // Formatar CPF enquanto digita
        document.addEventListener('DOMContentLoaded', () => {
            const cpfInput = document.getElementById('recipientCpf');
            if (cpfInput) {
                cpfInput.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\\D/g, '');
                    if (value.length <= 11) {
                        value = value.replace(/(\\d{3})(\\d)/, '$1.$2');
                        value = value.replace(/(\\d{3})(\\d)/, '$1.$2');
                        value = value.replace(/(\\d{3})(\\d{1,2})$/, '$1-$2');
                        e.target.value = value;
                    }
                });
            }
        });

        // Abrir modal
        function openModal() {
            document.getElementById('modalTitle').textContent = 'Novo Recibo';
            document.getElementById('receiptForm').reset();
            document.getElementById('receiptId').value = '';
            document.getElementById('receiptItemsContainer').innerHTML = '';
            receiptItemCounter = 0;
            
            // Adicionar primeiro item
            addReceiptItem();
            
            // Definir data de hoje
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('receiptDate').value = today;
            
            document.getElementById('receiptModal').classList.remove('hidden');
        }

        // Fechar modal
        function closeModal() {
            document.getElementById('receiptModal').classList.add('hidden');
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

        // Visualizar recibo
        async function viewReceipt(id) {
            try {
                const response = await fetch(\`/api/receipts/\${id}\`, {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                
                if (!response.ok) {
                    showToast('Erro ao carregar recibo', 'error');
                    return;
                }
                
                const receipt = await response.json();
                currentReceiptForPDF = receipt;
                
                // Formatar data
                const date = new Date(receipt.date + 'T00:00:00-03:00');
                const formattedDate = date.toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    timeZone: 'America/Fortaleza'
                });
                
                // Montar HTML dos itens
                const itemsHtml = receipt.items.map(item => \`
                    <tr>
                        <td class="border border-gray-300 px-3 py-2 text-center">\${item.quantity}</td>
                        <td class="border border-gray-300 px-3 py-2">\${item.description}</td>
                        <td class="border border-gray-300 px-3 py-2 text-right">R$ \${item.unit_value.toFixed(2).replace('.', ',')}</td>
                        <td class="border border-gray-300 px-3 py-2 text-right font-semibold">R$ \${item.total_value.toFixed(2).replace('.', ',')}</td>
                    </tr>
                \`).join('');
                
                const viewContent = \`
                    <div class="space-y-6" id="receiptToPrint">
                        <!-- Cabeçalho do Recibo -->
                        <div class="border-4 border-blue-600 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-white">
                            <div class="text-center">
                                <h1 class="text-3xl font-bold text-blue-600 mb-2">RECIBO</h1>
                                <p class="text-lg text-gray-700">Armazém Pai e Filho</p>
                                <p class="text-sm text-gray-600">Sistema de Gestão</p>
                            </div>
                            
                            <div class="mt-4 flex justify-between text-sm">
                                <div>
                                    <strong>Nº:</strong> \${receipt.receipt_number}
                                </div>
                                <div>
                                    <strong>Data:</strong> \${formattedDate}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Informações do Cliente -->
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-semibold text-gray-700 mb-3 text-lg">Dados do Cliente</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-gray-600">Nome:</p>
                                    <p class="font-medium text-gray-900">\${receipt.recipient_name}</p>
                                </div>
                                \${receipt.recipient_cpf ? \`
                                <div>
                                    <p class="text-sm text-gray-600">CPF:</p>
                                    <p class="font-medium text-gray-900">\${receipt.recipient_cpf}</p>
                                </div>
                                \` : ''}
                                <div>
                                    <p class="text-sm text-gray-600">Forma de Pagamento:</p>
                                    <p class="font-medium text-gray-900">\${receipt.payment_method}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tabela de Itens -->
                        <div>
                            <h3 class="font-semibold text-gray-700 mb-3 text-lg">Itens</h3>
                            <table class="min-w-full border-collapse border border-gray-300">
                                <thead class="bg-blue-600 text-white">
                                    <tr>
                                        <th class="border border-gray-300 px-3 py-2 text-center w-16">Qtd</th>
                                        <th class="border border-gray-300 px-3 py-2 text-left">Descrição</th>
                                        <th class="border border-gray-300 px-3 py-2 text-right w-32">Valor Unit.</th>
                                        <th class="border border-gray-300 px-3 py-2 text-right w-32">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${itemsHtml}
                                </tbody>
                                <tfoot class="bg-gray-100">
                                    <tr>
                                        <td colspan="3" class="border border-gray-300 px-3 py-3 text-right font-bold text-lg">TOTAL:</td>
                                        <td class="border border-gray-300 px-3 py-3 text-right font-bold text-xl text-blue-600">
                                            R$ \${receipt.total_value.toFixed(2).replace('.', ',')}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        \${receipt.description ? \`
                        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h4 class="font-semibold text-gray-700 mb-2">Observações</h4>
                            <p class="text-gray-700">\${receipt.description}</p>
                        </div>
                        \` : ''}
                        
                        <!-- Rodapé com assinatura -->
                        <div class="mt-8 pt-6 border-t-2 border-gray-300">
                            <div class="text-center">
                                <div class="inline-block">
                                    <div class="border-t-2 border-gray-800 pt-2 min-w-[300px]">
                                        <p class="text-sm font-medium text-gray-700">\${receipt.recipient_name}</p>
                                        <p class="text-xs text-gray-600">Assinatura do Recebedor</p>
                                    </div>
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 text-center mt-4">
                                Recibo gerado por: \${receipt.created_by_name} em \${new Date(receipt.created_at).toLocaleDateString('pt-BR', {timeZone: 'America/Fortaleza'})}
                            </p>
                        </div>
                    </div>
                \`;
                
                document.getElementById('viewContent').innerHTML = viewContent;
                document.getElementById('viewModal').classList.add('active');
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao visualizar recibo', 'error');
            }
        }

        function closeViewModal() {
            document.getElementById('viewModal').classList.remove('active');
            currentReceiptForPDF = null;
        }

        // Gerar PDF
        async function generatePDF() {
            if (!currentReceiptForPDF) {
                showToast('Nenhum recibo carregado', 'error');
                return;
            }
            
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                const receipt = currentReceiptForPDF;
                
                // Formatar data
                const date = new Date(receipt.date + 'T00:00:00-03:00');
                const formattedDate = date.toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    timeZone: 'America/Fortaleza'
                });
                
                // Cabeçalho
                doc.setFillColor(37, 99, 235);
                doc.rect(0, 0, 210, 40, 'F');
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(24);
                doc.setFont(undefined, 'bold');
                doc.text('RECIBO', 105, 15, { align: 'center' });
                
                doc.setFontSize(14);
                doc.setFont(undefined, 'normal');
                doc.text('Armazém Pai e Filho', 105, 25, { align: 'center' });
                doc.setFontSize(10);
                doc.text('Sistema de Gestão', 105, 32, { align: 'center' });
                
                // Informações do recibo
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.text(\`Nº: \${receipt.receipt_number}\`, 20, 50);
                doc.text(\`Data: \${formattedDate}\`, 150, 50);
                
                // Dados do cliente
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text('Dados do Cliente', 20, 65);
                
                doc.setFont(undefined, 'normal');
                doc.setFontSize(10);
                doc.text(\`Nome: \${receipt.recipient_name}\`, 20, 73);
                if (receipt.recipient_cpf) {
                    doc.text(\`CPF: \${receipt.recipient_cpf}\`, 20, 80);
                }
                doc.text(\`Pagamento: \${receipt.payment_method}\`, 120, 73);
                
                // Tabela de itens
                let yPosition = 95;
                doc.setFont(undefined, 'bold');
                doc.setFontSize(12);
                doc.text('Itens', 20, yPosition);
                
                yPosition += 10;
                
                // Cabeçalho da tabela
                doc.setFillColor(37, 99, 235);
                doc.rect(20, yPosition - 5, 170, 8, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(9);
                doc.text('Qtd', 25, yPosition);
                doc.text('Descrição', 45, yPosition);
                doc.text('Valor Unit.', 135, yPosition);
                doc.text('Total', 165, yPosition);
                
                yPosition += 8;
                
                // Itens
                doc.setTextColor(0, 0, 0);
                receipt.items.forEach(item => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    doc.text(item.quantity.toString(), 25, yPosition);
                    doc.text(item.description.substring(0, 50), 45, yPosition);
                    doc.text(\`R$ \${item.unit_value.toFixed(2).replace('.', ',')}\`, 135, yPosition);
                    doc.text(\`R$ \${item.total_value.toFixed(2).replace('.', ',')}\`, 165, yPosition);
                    yPosition += 7;
                });
                
                // Total
                yPosition += 5;
                doc.setFillColor(240, 240, 240);
                doc.rect(20, yPosition - 5, 170, 10, 'F');
                doc.setFont(undefined, 'bold');
                doc.setFontSize(12);
                doc.text('TOTAL:', 135, yPosition);
                doc.setTextColor(37, 99, 235);
                doc.setFontSize(14);
                doc.text(\`R$ \${receipt.total_value.toFixed(2).replace('.', ',')}\`, 165, yPosition);
                
                // Observações
                if (receipt.description) {
                    yPosition += 15;
                    if (yPosition > 250) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(10);
                    doc.setFont(undefined, 'bold');
                    doc.text('Observações:', 20, yPosition);
                    doc.setFont(undefined, 'normal');
                    const lines = doc.splitTextToSize(receipt.description, 170);
                    doc.text(lines, 20, yPosition + 7);
                    yPosition += (lines.length * 5) + 10;
                }
                
                // Assinatura
                yPosition += 20;
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.line(80, yPosition, 130, yPosition);
                doc.setFontSize(9);
                doc.text(receipt.recipient_name, 105, yPosition + 5, { align: 'center' });
                doc.setFontSize(8);
                doc.text('Assinatura do Recebedor', 105, yPosition + 10, { align: 'center' });
                
                // Rodapé
                doc.setFontSize(7);
                doc.setTextColor(100, 100, 100);
                doc.text(\`Gerado por: \${receipt.created_by_name} - \${new Date().toLocaleString('pt-BR', {timeZone: 'America/Fortaleza'})}\`, 105, 285, { align: 'center' });
                
                // Salvar PDF
                doc.save(\`Recibo_\${receipt.receipt_number.replace(/\\//g, '_')}.pdf\`);
                showToast('PDF gerado com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                showToast('Erro ao gerar PDF', 'error');
            }
        }

        // Baixar PDF diretamente
        async function downloadPDF(id) {
            await viewReceipt(id);
            // Aguardar um pouco para o modal carregar
            setTimeout(() => {
                generatePDF();
            }, 500);
        }

        // Editar recibo
        async function editReceipt(id) {
            try {
                const response = await fetch(\`/api/receipts/\${id}\`, {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                
                if (!response.ok) {
                    showToast('Erro ao carregar recibo', 'error');
                    return;
                }
                
                const receipt = await response.json();
                
                document.getElementById('modalTitle').textContent = 'Editar Recibo';
                document.getElementById('receiptId').value = receipt.id;
                document.getElementById('receiptNumber').value = receipt.receipt_number;
                document.getElementById('receiptDate').value = receipt.date;
                document.getElementById('recipientName').value = receipt.recipient_name;
                document.getElementById('recipientCpf').value = receipt.recipient_cpf || '';
                document.getElementById('paymentMethod').value = receipt.payment_method;
                document.getElementById('description').value = receipt.description || '';
                
                // Limpar e recriar itens
                document.getElementById('receiptItemsContainer').innerHTML = '';
                receiptItemCounter = 0;
                
                if (receipt.items && receipt.items.length > 0) {
                    receipt.items.forEach(item => {
                        addReceiptItem(item);
                    });
                } else {
                    addReceiptItem();
                }
                
                calculateTotal();
                document.getElementById('receiptModal').classList.remove('hidden');
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao editar recibo', 'error');
            }
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

        // Submeter formulário
        document.getElementById('receiptForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const receiptId = document.getElementById('receiptId').value;
            const receiptNumber = document.getElementById('receiptNumber').value;
            const receiptDate = document.getElementById('receiptDate').value;
            const recipientName = document.getElementById('recipientName').value;
            const recipientCpf = document.getElementById('recipientCpf').value;
            const paymentMethod = document.getElementById('paymentMethod').value;
            const description = document.getElementById('description').value;
            
            // Coletar itens
            const items = [];
            document.querySelectorAll('.receipt-item').forEach(item => {
                const quantity = parseInt(item.querySelector('.item-quantity').value);
                const itemDescription = item.querySelector('.item-description').value;
                const unitValue = parseFloat(item.querySelector('.item-unit-value').value);
                
                if (quantity > 0 && itemDescription && unitValue > 0) {
                    items.push({
                        quantity,
                        description: itemDescription,
                        unit_value: unitValue
                    });
                }
            });
            
            if (items.length === 0) {
                showToast('Adicione pelo menos um item ao recibo', 'warning');
                return;
            }
            
            const data = {
                receipt_number: receiptNumber,
                date: receiptDate,
                recipient_name: recipientName,
                recipient_cpf: recipientCpf,
                payment_method: paymentMethod,
                description,
                items
            };
            
            try {
                const url = receiptId ? \`/api/receipts/\${receiptId}\` : '/api/receipts';
                const method = receiptId ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${token}\`
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showToast(receiptId ? 'Recibo atualizado com sucesso!' : 'Recibo criado com sucesso!', 'success');
                    closeModal();
                    loadReceipts();
                } else {
                    const error = await response.json();
                    showToast(\`Erro: \${error.error}\`, 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao salvar recibo', 'error');
            }
        });

        // Definir mês atual no filtro
        const now = new Date();
        document.getElementById('monthFilter').value = now.toISOString().slice(0, 7);

        // Carregar dados ao iniciar
        loadReceipts();
    </script>
</body>
</html>`;
