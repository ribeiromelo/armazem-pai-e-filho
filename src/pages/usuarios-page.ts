export const usuariosPage = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usuários - Armazém Pai e Filho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }
        
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
        
        #overlay {
            display: none;
        }
        
        #overlay.active {
            display: block;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 50;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        
        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
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
    </style>
</head>
<body class="bg-gray-50">
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
                <a href="/financeiro" class="flex items-center px-6 py-3 hover:bg-blue-700 transition-colors">
                    <i class="fas fa-chart-line mr-3"></i>
                    Financeiro
                </a>
                <a href="/usuarios" class="flex items-center px-6 py-3 bg-blue-700 border-l-4 border-white">
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
                <div class="px-4 md:px-8 py-4 flex items-center justify-between">
                    <div class="flex items-center">
                        <button onclick="toggleSidebar()" class="md:hidden mr-4 text-gray-600 hover:text-gray-800">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                        
                        <div>
                            <h2 class="text-xl md:text-2xl font-semibold text-gray-800">Usuários</h2>
                            <p class="text-gray-600 text-xs md:text-sm mt-1">Gerenciar usuários do sistema</p>
                        </div>
                    </div>
                    
                    <button onclick="openModal()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                        <i class="fas fa-plus"></i>
                        <span class="hidden md:inline">Novo Usuário</span>
                    </button>
                </div>
            </header>

            <!-- Content -->
            <div class="p-4 md:p-8">
                <!-- Tabela de Usuários -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissão</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody id="usersTable" class="bg-white divide-y divide-gray-200">
                                <!-- Será preenchido via JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Modal de Criar/Editar -->
    <div id="userModal" class="modal">
        <div class="modal-content p-6 md:p-8">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-800" id="modalTitle">Novo Usuário</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            
            <form id="userForm">
                <input type="hidden" id="userId">
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                    <input type="text" id="name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nome de Usuário *</label>
                    <input type="text" id="username" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Senha <span id="passwordHint" class="text-gray-500">(deixe em branco para manter a atual)</span></label>
                    <input type="password" id="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Permissão *</label>
                    <select id="permission" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="view">Visualizador (apenas leitura)</option>
                        <option value="edit">Editor (criar e editar)</option>
                        <option value="admin">Administrador (acesso total)</option>
                    </select>
                </div>
                
                <div class="mb-6">
                    <label class="flex items-center">
                        <input type="checkbox" id="is_admin" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                        <span class="ml-2 text-sm text-gray-700">Administrador do sistema</span>
                    </label>
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

    <script>
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token || !user.is_admin) {
            window.location.href = '/dashboard';
        }

        document.getElementById('userName').textContent = user.name || 'Usuário';
        document.getElementById('userRole').textContent = 'Administrador';

        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }

        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('active');
            document.getElementById('overlay').classList.toggle('active');
        }

        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = \`toast \${type}\`;
            toast.innerHTML = \`
                <div class="flex items-center space-x-3">
                    <i class="fas \${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl"></i>
                    <span>\${message}</span>
                </div>
            \`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        async function loadUsers() {
            try {
                const response = await fetch('/api/users', {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                
                if (response.ok) {
                    const users = await response.json();
                    renderUsers(users);
                } else {
                    showToast('Erro ao carregar usuários', 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao carregar usuários', 'error');
            }
        }

        function renderUsers(users) {
            const tbody = document.getElementById('usersTable');
            
            if (users.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                            Nenhum usuário encontrado
                        </td>
                    </tr>
                \`;
                return;
            }
            
            tbody.innerHTML = users.map(u => \`
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">\${u.name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${u.username}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full \${
                            u.permission === 'admin' ? 'bg-red-100 text-red-800' :
                            u.permission === 'edit' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }">
                            \${u.permission === 'admin' ? 'Admin' : u.permission === 'edit' ? 'Editor' : 'Visualizador'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-900">\${u.is_admin ? 'Sim' : 'Não'}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="editUser(\${u.id})" class="text-blue-600 hover:text-blue-900 mr-3" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        \${u.id !== user.id ? \`
                            <button onclick="deleteUser(\${u.id}, '\${u.name}')" class="text-red-600 hover:text-red-900" title="Deletar">
                                <i class="fas fa-trash"></i>
                            </button>
                        \` : ''}
                    </td>
                </tr>
            \`).join('');
        }

        function openModal() {
            document.getElementById('modalTitle').textContent = 'Novo Usuário';
            document.getElementById('userForm').reset();
            document.getElementById('userId').value = '';
            document.getElementById('password').required = true;
            document.getElementById('passwordHint').style.display = 'none';
            document.getElementById('userModal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('userModal').classList.remove('active');
        }

        async function editUser(id) {
            try {
                const response = await fetch(\`/api/users/\${id}\`, {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    document.getElementById('modalTitle').textContent = 'Editar Usuário';
                    document.getElementById('userId').value = userData.id;
                    document.getElementById('name').value = userData.name;
                    document.getElementById('username').value = userData.username;
                    document.getElementById('password').value = '';
                    document.getElementById('password').required = false;
                    document.getElementById('passwordHint').style.display = 'inline';
                    document.getElementById('permission').value = userData.permission;
                    document.getElementById('is_admin').checked = userData.is_admin;
                    document.getElementById('userModal').classList.add('active');
                } else {
                    showToast('Erro ao carregar usuário', 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao carregar usuário', 'error');
            }
        }

        async function deleteUser(id, name) {
            if (!confirm(\`Tem certeza que deseja deletar o usuário "\${name}"?\`)) {
                return;
            }
            
            try {
                const response = await fetch(\`/api/users/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                
                if (response.ok) {
                    showToast('Usuário deletado com sucesso!', 'success');
                    loadUsers();
                } else {
                    const error = await response.json();
                    showToast(\`Erro: \${error.error}\`, 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao deletar usuário', 'error');
            }
        }

        document.getElementById('userForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userId = document.getElementById('userId').value;
            const name = document.getElementById('name').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const permission = document.getElementById('permission').value;
            const is_admin = document.getElementById('is_admin').checked;
            
            const data = { name, username, permission, is_admin };
            if (password) data.password = password;
            
            try {
                const url = userId ? \`/api/users/\${userId}\` : '/api/users';
                const method = userId ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${token}\`
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showToast(userId ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!', 'success');
                    closeModal();
                    loadUsers();
                } else {
                    const error = await response.json();
                    showToast(\`Erro: \${error.error}\`, 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao salvar usuário', 'error');
            }
        });

        loadUsers();
    </script>
</body>
</html>`;
