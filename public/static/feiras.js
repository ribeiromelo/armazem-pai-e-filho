// ===================================
// FEIRAS - JavaScript Standalone
// ===================================

console.log('=== FEIRAS.JS CARREGADO ===');

// Verificar autenticação
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

console.log('Token exists:', !!token);
console.log('User:', user);

if (!token) {
    console.warn('Sem token, redirecionando...');
    window.location.href = '/';
}

// Exibir informações do usuário
if (document.getElementById('userName')) {
    document.getElementById('userName').textContent = user.name || 'Usuário';
}

if (document.getElementById('userRole')) {
    const userRole = user.permission === 'admin' ? 'Administrador' : 
                     user.permission === 'edit' ? 'Editor' : 'Visualizador';
    document.getElementById('userRole').textContent = userRole;
}

// Ocultar menu de usuários se não for admin
if (user.permission !== 'admin') {
    const usersMenu = document.getElementById('usersMenu');
    if (usersMenu) usersMenu.style.display = 'none';
}

// Ocultar botão de adicionar feira se for apenas visualizador
if (user.permission === 'view') {
    const btnAddFair = document.getElementById('btnAddFair');
    if (btnAddFair) btnAddFair.style.display = 'none';
}

// Função de logout
window.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
};

// Função para exibir toast
window.showToast = function(message, type = 'success') {
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle';
    const color = type === 'success' ? 'green' : 
                  type === 'error' ? 'red' : 'yellow';
    
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 bg-white border-l-4 border-${color}-500 p-4 rounded shadow-lg z-50 flex items-center gap-3`;
    toast.innerHTML = `
        <i class="fas ${icon} text-${color}-500"></i>
        <span class="text-gray-700">${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// Variáveis globais
let currentFairId = null;

// Função para calcular total
window.calculateTotal = function() {
    const items = document.querySelectorAll('.fair-item');
    let total = 0;
    
    items.forEach(item => {
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const unitValue = parseFloat(item.querySelector('.item-unit-value').value) || 0;
        total += quantity * unitValue;
    });
    
    const previewTotal = document.getElementById('previewTotal');
    if (previewTotal) {
        previewTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
};

// Função para adicionar item
window.addFairItem = function() {
    const container = document.getElementById('fairItemsContainer');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'fair-item flex gap-2 items-center bg-gray-50 p-2 rounded';
    itemDiv.innerHTML = `
        <input type="number" class="item-quantity border rounded px-2 py-1 w-20" placeholder="Qtd" min="0" step="0.01" onchange="calculateTotal()">
        <input type="text" class="item-category flex-1 border rounded px-2 py-1" placeholder="Categoria">
        <input type="number" class="item-unit-value border rounded px-2 py-1 w-32" placeholder="Valor Unit." min="0" step="0.01" onchange="calculateTotal()">
        <button type="button" onclick="removeFairItem(this)" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(itemDiv);
};

// Função para remover item
window.removeFairItem = function(button) {
    button.closest('.fair-item').remove();
    calculateTotal();
};

// Função para abrir modal
window.openModal = function(fairId = null) {
    currentFairId = fairId;
    const modal = document.getElementById('fairModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (modal) modal.classList.remove('hidden');
    if (modalTitle) modalTitle.textContent = fairId ? 'Editar Feira' : 'Nova Feira';
    
    if (!fairId) {
        const form = document.getElementById('fairForm');
        if (form) form.reset();
        
        const container = document.getElementById('fairItemsContainer');
        if (container) container.innerHTML = '';
        
        addFairItem();
        calculateTotal();
    }
};

// Função para fechar modal
window.closeModal = function() {
    const modal = document.getElementById('fairModal');
    if (modal) modal.classList.add('hidden');
    
    const form = document.getElementById('fairForm');
    if (form) form.reset();
    
    currentFairId = null;
};

// Função para limpar filtros
window.clearFilters = function() {
    const monthFilter = document.getElementById('monthFilter');
    const yearFilter = document.getElementById('yearFilter');
    
    if (monthFilter) monthFilter.value = '';
    if (yearFilter) yearFilter.value = new Date().getFullYear();
    
    loadFairs();
};

// Função para carregar estatísticas
window.loadStats = async function() {
    try {
        const month = document.getElementById('monthFilter')?.value || '';
        const year = document.getElementById('yearFilter')?.value || '';
        
        let url = '/api/fairs/stats/summary';
        const params = [];
        if (month) params.push(`month=${month}`);
        if (year) params.push(`year=${year}`);
        if (params.length > 0) url += `?${params.join('&')}`;
        
        console.log('Carregando stats:', url);
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar estatísticas');
        
        const stats = await response.json();
        console.log('Stats:', stats);
        
        if (document.getElementById('totalFairs')) {
            document.getElementById('totalFairs').textContent = stats.total_fairs || 0;
        }
        if (document.getElementById('totalRevenue')) {
            document.getElementById('totalRevenue').textContent = `R$ ${(stats.total_revenue || 0).toFixed(2).replace('.', ',')}`;
        }
        if (document.getElementById('averageRevenue')) {
            document.getElementById('averageRevenue').textContent = `R$ ${(stats.average_revenue || 0).toFixed(2).replace('.', ',')}`;
        }
        if (document.getElementById('maxRevenue')) {
            document.getElementById('maxRevenue').textContent = `R$ ${(stats.max_revenue || 0).toFixed(2).replace('.', ',')}`;
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
};

// Função para carregar feiras
window.loadFairs = async function() {
    try {
        const month = document.getElementById('monthFilter')?.value || '';
        const year = document.getElementById('yearFilter')?.value || '';
        
        let url = '/api/fairs';
        const params = [];
        if (month) params.push(`month=${month}`);
        if (year) params.push(`year=${year}`);
        if (params.length > 0) url += `?${params.join('&')}`;
        
        console.log('Carregando feiras:', url);
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('Response status:', response.status);
        console.log('Response Content-Type:', response.headers.get('Content-Type'));
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const fairs = await response.json();
        console.log('Feiras carregadas:', fairs.length);
        
        renderFairs(fairs);
        loadStats();
    } catch (error) {
        console.error('Erro ao carregar feiras:', error);
        showToast('Erro ao carregar feiras', 'error');
    }
};

// Função para renderizar feiras
window.renderFairs = function(fairs) {
    const tbody = document.getElementById('fairsTable');
    
    if (!tbody) {
        console.error('Elemento fairsTable não encontrado');
        return;
    }
    
    if (!fairs || fairs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">Nenhuma feira encontrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = fairs.map(fair => {
        const statusBadge = fair.status === 'finalized' 
            ? '<span class="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Finalizada</span>'
            : '<span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">Em aberto</span>';
        
        const totalValue = `R$ ${parseFloat(fair.total_value || 0).toFixed(2).replace('.', ',')}`;
        
        const profitLine = fair.status === 'finalized' && fair.total_profit !== null
            ? `<br><span class="text-xs text-gray-600">Lucro: R$ ${parseFloat(fair.total_profit || 0).toFixed(2).replace('.', ',')}</span>`
            : '';
        
        const canEdit = user.permission !== 'view';
        const isOpen = fair.status !== 'finalized';
        const isAdmin = user.permission === 'admin';
        
        return `
            <tr class="border-b hover:bg-gray-50">
                <td class="px-6 py-4 text-sm">${fair.id}</td>
                <td class="px-6 py-4 text-sm">${fair.location}</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-sm">${fair.items_count || 0} itens</td>
                <td class="px-6 py-4 text-sm font-medium">${totalValue}${profitLine}</td>
                <td class="px-6 py-4 text-sm">${fair.created_by_name || 'N/A'}</td>
                <td class="px-6 py-4 text-sm">
                    <div class="flex gap-2">
                        <button onclick="viewFair(${fair.id})" class="text-blue-600 hover:text-blue-800" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${isOpen && canEdit ? `
                            <button onclick="finalizeFair(${fair.id})" class="text-green-600 hover:text-green-800" title="Finalizar">
                                <i class="fas fa-check-circle"></i>
                            </button>
                            <button onclick="editFair(${fair.id})" class="text-yellow-600 hover:text-yellow-800" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                        ${isAdmin ? `
                            <button onclick="deleteFair(${fair.id})" class="text-red-600 hover:text-red-800" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
};

// Função para toggle do sidebar
window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('hidden');
};

// Event listener para o formulário (quando o DOM estiver pronto)
document.addEventListener('DOMContentLoaded', () => {
    const fairForm = document.getElementById('fairForm');
    if (fairForm) {
        fairForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fairDate = document.getElementById('fairDate')?.value;
            const location = document.getElementById('location')?.value;
            const observations = document.getElementById('observations')?.value || '';
            
            const items = [];
            document.querySelectorAll('.fair-item').forEach(item => {
                const quantity = parseFloat(item.querySelector('.item-quantity')?.value);
                const category = item.querySelector('.item-category')?.value;
                const unitValue = parseFloat(item.querySelector('.item-unit-value')?.value);
                
                if (quantity && category && unitValue) {
                    const itemData = {
                        quantity: quantity,
                        category: category,
                        unit_value: unitValue
                    };
                    
                    const itemId = item.querySelector('.item-id');
                    if (itemId) {
                        itemData.id = parseInt(itemId.value);
                    }
                    
                    items.push(itemData);
                }
            });
            
            if (items.length === 0) {
                showToast('Adicione pelo menos um item à feira', 'error');
                return;
            }
            
            const data = {
                date: fairDate,
                location: location,
                observations: observations,
                items: items
            };
            
            try {
                const method = currentFairId ? 'PUT' : 'POST';
                const url = currentFairId ? `/api/fairs/${currentFairId}` : '/api/fairs';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Erro ao salvar feira');
                }
                
                showToast(currentFairId ? 'Feira atualizada com sucesso' : 'Feira criada com sucesso');
                closeModal();
                loadFairs();
            } catch (error) {
                console.error('Erro:', error);
                showToast(error.message, 'error');
            }
        });
    }
    
    // Carregar feiras ao iniciar
    console.log('Iniciando loadFairs...');
    loadFairs();
});
