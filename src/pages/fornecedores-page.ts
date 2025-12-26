export const fornecedoresPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fornecedores - Armazém Pai e Filho</title>
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
        
        /* Modal Customizado */
        .modal {
            display: none;
            position: fixed;
            z-index: 50;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            animation: fadeIn 0.2s;
        }
        
        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background-color: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 90%;
            animation: slideIn 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
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
                <a href="/fornecedores" class="flex items-center px-6 py-3 bg-blue-700 border-l-4 border-white">
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
                <div class="px-4 md:px-8 py-4 flex justify-between items-center">
                    <div class="flex items-center flex-1">
                        <!-- Botão Menu Mobile -->
                        <button onclick="toggleSidebar()" class="md:hidden mr-3 text-gray-600 hover:text-gray-800">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                        
                        <div>
                            <h2 class="text-xl md:text-2xl font-semibold text-gray-800">Fornecedores</h2>
                            <p class="text-gray-600 text-xs md:text-sm mt-1 hidden sm:block">Gerenciar fornecedores do armazém</p>
                        </div>
                    </div>
                    <button onclick="openAddModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg flex items-center text-sm md:text-base">
                        <i class="fas fa-plus mr-1 md:mr-2"></i>
                        <span class="hidden sm:inline">Novo</span>
                        <span class="hidden md:inline"> Fornecedor</span>
                    </button>
                </div>
            </header>

            <!-- Content -->
            <div class="p-4 md:p-8">
                <!-- Filtros -->
                <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                            <input type="text" id="searchInput" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nome do fornecedor...">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Produto</label>
                            <select id="productFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Todos</option>
                                <option value="Feijão">Feijão</option>
                                <option value="Milho">Milho</option>
                                <option value="Arroz">Arroz</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select id="statusFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Todos</option>
                                <option value="active">Ativo</option>
                                <option value="settled">Quitado</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Tabela -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[600px]">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Produto
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data de Cadastro
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200" id="suppliersTable">
                            <tr>
                                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
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
    <div id="supplierModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-lg p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-semibold mb-4" id="modalTitle">Novo Fornecedor</h3>
            <form id="supplierForm">
                <input type="hidden" id="supplierId">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <input type="text" id="supplierName" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Produto</label>
                    <input type="text" id="productType" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: Feijão, Milho, Arroz">
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select id="supplierStatus" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="active">Ativo</option>
                        <option value="settled">Quitado</option>
                    </select>
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

    <!-- Modal de Confirmação de Exclusão -->
    <div id="deleteModal" class="modal">
        <div class="modal-content">
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Excluir Fornecedor?</h3>
                <p class="text-sm text-gray-500 mb-6">Esta ação não pode ser desfeita. Deseja realmente excluir este fornecedor?</p>
                <div class="flex gap-3">
                    <button onclick="closeDeleteModal()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button onclick="confirmDelete()" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de Erro -->
    <div id="errorModal" class="modal">
        <div class="modal-content">
            <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                    <i class="fas fa-exclamation-circle text-yellow-600 text-xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Não é Possível Excluir</h3>
                <p class="text-sm text-gray-600 mb-6" id="errorMessage"></p>
                <button onclick="closeErrorModal()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Entendi
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

        let suppliers = [];

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
                    renderSuppliers();
                }
            } catch (error) {
                console.error('Erro ao carregar fornecedores:', error);
            }
        }

        // Renderizar tabela
        function renderSuppliers() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const productFilter = document.getElementById('productFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;
            
            const filtered = suppliers.filter(s => {
                const matchSearch = s.name.toLowerCase().includes(searchTerm);
                const matchProduct = !productFilter || s.product_type === productFilter;
                const matchStatus = !statusFilter || s.status === statusFilter;
                return matchSearch && matchProduct && matchStatus;
            });

            const html = filtered.map(supplier => \`
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">\${supplier.name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${supplier.product_type}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${
                            supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }">
                            \${supplier.status === 'active' ? 'Ativo' : 'Quitado'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        \${new Date(supplier.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="editSupplier(\${supplier.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                            <i class="fas fa-edit"></i>
                        </button>
                        \${user.permission === 'admin' ? \`
                            <button onclick="deleteSupplier(\${supplier.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i>
                            </button>
                        \` : ''}
                    </td>
                </tr>
            \`).join('');
            
            document.getElementById('suppliersTable').innerHTML = html || \`
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                        Nenhum fornecedor encontrado
                    </td>
                </tr>
            \`;
        }

        // Event listeners para filtros
        document.getElementById('searchInput').addEventListener('input', renderSuppliers);
        document.getElementById('productFilter').addEventListener('change', renderSuppliers);
        document.getElementById('statusFilter').addEventListener('change', renderSuppliers);

        // Modal functions
        function openAddModal() {
            document.getElementById('modalTitle').textContent = 'Novo Fornecedor';
            document.getElementById('supplierForm').reset();
            document.getElementById('supplierId').value = '';
            document.getElementById('supplierModal').classList.remove('hidden');
        }

        function editSupplier(id) {
            const supplier = suppliers.find(s => s.id === id);
            if (supplier) {
                document.getElementById('modalTitle').textContent = 'Editar Fornecedor';
                document.getElementById('supplierId').value = supplier.id;
                document.getElementById('supplierName').value = supplier.name;
                document.getElementById('productType').value = supplier.product_type;
                document.getElementById('supplierStatus').value = supplier.status;
                document.getElementById('supplierModal').classList.remove('hidden');
            }
        }

        function closeModal() {
            document.getElementById('supplierModal').classList.add('hidden');
        }

        // Form submit
        document.getElementById('supplierForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('supplierId').value;
            const data = {
                name: document.getElementById('supplierName').value,
                product_type: document.getElementById('productType').value,
                status: document.getElementById('supplierStatus').value
            };
            
            try {
                const response = await fetch(id ? \`/api/suppliers/\${id}\` : '/api/suppliers', {
                    method: id ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${token}\`
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    closeModal();
                    loadSuppliers();
                } else {
                    const error = await response.json();
                    alert(error.error || 'Erro ao salvar fornecedor');
                }
            } catch (error) {
                alert('Erro ao salvar fornecedor');
            }
        });

        async function deleteSupplier(id) {
            window.deleteId = id;
            document.getElementById('deleteModal').classList.add('active');
        }

        function closeDeleteModal() {
            document.getElementById('deleteModal').classList.remove('active');
            window.deleteId = null;
        }

        async function confirmDelete() {
            const id = window.deleteId;
            if (!id) return;
            
            try {
                const response = await fetch(\`/api/suppliers/\${id}\`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    closeDeleteModal();
                    loadSuppliers();
                } else {
                    const errorData = await response.json();
                    closeDeleteModal();
                    
                    // Mostrar modal de erro customizado
                    const errorMsg = document.getElementById('errorMessage');
                    
                    if (response.status === 400) {
                        // Erro de validação (fornecedor com fichas)
                        errorMsg.textContent = 'Este fornecedor possui fichas semanais associadas. Para excluí-lo, primeiro delete as fichas vinculadas a ele.';
                    } else if (response.status === 403) {
                        errorMsg.textContent = 'Você não tem permissão para excluir fornecedores.';
                    } else {
                        errorMsg.textContent = errorData.error || 'Erro ao excluir fornecedor. Tente novamente.';
                    }
                    
                    document.getElementById('errorModal').classList.add('active');
                }
            } catch (error) {
                console.error('Erro:', error);
                closeDeleteModal();
                
                const errorMsg = document.getElementById('errorMessage');
                errorMsg.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
                document.getElementById('errorModal').classList.add('active');
            }
        }

        function closeErrorModal() {
            document.getElementById('errorModal').classList.remove('active');
        }

        // Expor funções globalmente para onclick
        window.deleteSupplier = deleteSupplier;
        window.closeDeleteModal = closeDeleteModal;
        window.confirmDelete = confirmDelete;
        window.closeErrorModal = closeErrorModal;

        // Toggle sidebar mobile
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        // Carregar dados ao iniciar
        loadSuppliers();
    </script>
</body>
</html>`;