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
            document.getElementById('btnAddFair').style.display = 'none';
        }

        // Função de logout
        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
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

        let fairs = [];
        let fairItemCounter = 0;

        // Calcular total em tempo real
        function calculateTotal() {
            const items = document.querySelectorAll('.fair-item');
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

        // Adicionar item à feira
        function addFairItem() {
            const container = document.getElementById('fairItemsContainer');
            const itemId = fairItemCounter++;
            
            const itemHtml = \`
                <div class="fair-item border border-gray-200 rounded-lg p-4" data-item-id="\${itemId}">
                    <div class="grid grid-cols-5 gap-3 items-end">
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">Quantidade</label>
                            <input type="number" class="item-quantity w-full px-2 py-1 border border-gray-300 rounded text-sm" 
                                   min="1" value="1" onchange="calculateTotal()" required>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-xs text-gray-600 mb-1">Categoria/Item</label>
                            <input type="text" class="item-category w-full px-2 py-1 border border-gray-300 rounded text-sm" 
                                   placeholder="Ex: Caixas de banana" required>
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600 mb-1">Valor Unit.</label>
                            <input type="number" class="item-unit-value w-full px-2 py-1 border border-gray-300 rounded text-sm" 
                                   step="0.01" min="0" value="0" onchange="calculateTotal()" required>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <label class="block text-xs text-gray-600 mb-1">Total</label>
                                <div class="item-total font-semibold text-blue-600">R$ 0,00</div>
                            </div>
                            <button type="button" onclick="removeFairItem(\${itemId})" class="text-red-600 hover:text-red-800 ml-2">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            \`;
            
            container.insertAdjacentHTML('beforeend', itemHtml);
            calculateTotal();
        }

        // Remover item da feira
        function removeFairItem(itemId) {
            const item = document.querySelector(\`[data-item-id="\${itemId}"]\`);
            if (item) {
                item.remove();
                calculateTotal();
            }
        }

        // Abrir modal
        function openModal() {
            document.getElementById('modalTitle').textContent = 'Nova Feira';
            document.getElementById('fairForm').reset();
            document.getElementById('fairId').value = '';
            document.getElementById('fairItemsContainer').innerHTML = '';
            fairItemCounter = 0;
            
            // Adicionar primeiro item
            addFairItem();
            
            // Definir data de hoje
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('fairDate').value = today;
            
            document.getElementById('fairModal').classList.remove('hidden');
        }

        // Fechar modal
        function closeModal() {
            document.getElementById('fairModal').classList.add('hidden');
        }

        // Inicializar filtros de ano
        function initializeYearFilter() {
            const yearFilter = document.getElementById('yearFilter');
            const currentYear = new Date().getFullYear();
            
            for (let year = currentYear; year >= currentYear - 5; year--) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearFilter.appendChild(option);
            }
            
            yearFilter.value = currentYear;
        }

        // Limpar filtros
        function clearFilters() {
            document.getElementById('monthFilter').value = '';
            document.getElementById('yearFilter').value = '';
            loadFairs();
        }

        // Carregar feiras
        async function loadFairs() {
            try {
                const month = document.getElementById('monthFilter').value;
                const year = document.getElementById('yearFilter').value;
                
                let url = '/api/fairs?';
                if (month) url += \`month=\${month}&\`;
                if (year) url += \`year=\${year}&\`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    fairs = await response.json();
                    renderFairs();
                    loadStats();
                }
            } catch (error) {
                console.error('Erro ao carregar feiras:', error);
            }
        }

        // Carregar estatísticas
        async function loadStats() {
            try {
                const month = document.getElementById('monthFilter').value;
                const year = document.getElementById('yearFilter').value;
                
                let url = '/api/fairs/stats/summary?';
                if (month) url += \`month=\${month}&\`;
                if (year) url += \`year=\${year}&\`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    const stats = await response.json();
                    
                    document.getElementById('totalFairs').textContent = stats.total_fairs;
                    document.getElementById('totalRevenue').textContent = \`R$ \${stats.total_revenue.toFixed(2).replace('.', ',')}\`;
                    document.getElementById('avgRevenue').textContent = \`R$ \${stats.average_revenue.toFixed(2).replace('.', ',')}\`;
                    document.getElementById('maxRevenue').textContent = \`R$ \${stats.max_revenue.toFixed(2).replace('.', ',')}\`;
                }
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            }
        }

        // Renderizar feiras
        function renderFairs() {
            const html = fairs.map(fair => {
                // Formatar data no padrão brasileiro com horário de Fortaleza
                const date = new Date(fair.date + 'T00:00:00-03:00');
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
                        <div class="text-sm font-medium text-gray-900">\${fair.location}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${
                            fair.status === 'finalized' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }">
                            \${fair.status === 'finalized' ? 'Finalizada' : 'Em aberto'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${fair.items_count} itens</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-semibold text-green-600">R$ \${fair.total_value.toFixed(2).replace('.', ',')}</div>
                        \${fair.status === 'finalized' && fair.total_profit !== null ? \`
                            <div class="text-xs text-gray-500">Lucro: R$ \${fair.total_profit.toFixed(2).replace('.', ',')}</div>
                        \` : ''}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">\${fair.created_by_name}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="viewFair(\${fair.id})" class="text-blue-600 hover:text-blue-900 mr-2" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        \${fair.status === 'open' && user.permission !== 'view' ? \`
                            <button onclick="finalizeFair(\${fair.id})" class="text-green-600 hover:text-green-900 mr-2" title="Finalizar feira">
                                <i class="fas fa-check-circle"></i>
                            </button>
                            <button onclick="editFair(\${fair.id})" class="text-yellow-600 hover:text-yellow-900 mr-2" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                        \` : ''}
                        \${user.permission !== 'view' && fair.status === 'open' ? '' : ''}
                            <button onclick="editFair(\${fair.id})" class="text-yellow-600 hover:text-yellow-900 mr-2">
                                <i class="fas fa-edit"></i>
                            </button>
                        \` : ''}
                        \${user.permission === 'admin' ? \`
                            <button onclick="deleteFair(\${fair.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i>
                            </button>
                        \` : ''}
                    </td>
                </tr>
            \`;
            }).join('');
            
            document.getElementById('fairsTable').innerHTML = html || \`
                <tr>
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                        Nenhuma feira encontrada
                    </td>
                </tr>
            \`;
        }

        // Visualizar feira
        function viewFair(id) {
            const fair = fairs.find(f => f.id === id);
            if (!fair) return;
            
            // Buscar detalhes completos da feira
            fetch(\`/api/fairs/\${id}\`, {
                headers: { 'Authorization': \`Bearer \${token}\` }
            })
            .then(r => r.json())
            .then(fairDetails => {
                const date = new Date(fairDetails.date + 'T00:00:00-03:00');
                const formattedDate = date.toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    timeZone: 'America/Fortaleza'
                });
                
                const itemsHtml = fairDetails.items.map(item => \`
                    <tr>
                        <td class="border px-3 py-2 text-center">\${item.quantity}</td>
                        <td class="border px-3 py-2">\${item.category}</td>
                        <td class="border px-3 py-2 text-right">R$ \${item.unit_value.toFixed(2).replace('.', ',')}</td>
                        <td class="border px-3 py-2 text-right font-semibold">R$ \${item.total_value.toFixed(2).replace('.', ',')}</td>
                    </tr>
                \`).join('');
                
                const viewContent = \`
                    <div class="space-y-6" id="fairToPrint">
                        <!-- Cabeçalho -->
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="text-xl font-bold text-blue-800">Feira #\${fairDetails.id}</h3>
                                    <p class="text-gray-600 mt-1">Data: \${formattedDate}</p>
                                    <p class="text-gray-600">Local: \${fairDetails.location}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-gray-600">Registrada por:</p>
                                    <p class="font-semibold">\${fairDetails.created_by_name}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tabela de Itens -->
                        <div>
                            <h4 class="font-semibold text-gray-700 mb-2">Itens Levados</h4>
                            <table class="min-w-full border-collapse border">
                                <thead class="bg-gray-100">
                                    <tr>
                                        <th class="border px-3 py-2 text-center">Qtd</th>
                                        <th class="border px-3 py-2 text-left">Categoria/Item</th>
                                        <th class="border px-3 py-2 text-right">Valor Unit.</th>
                                        <th class="border px-3 py-2 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${itemsHtml}
                                </tbody>
                                <tfoot class="bg-gray-100">
                                    <tr>
                                        <td colspan="3" class="border px-3 py-2 text-right font-semibold">Total da Feira:</td>
                                        <td class="border px-3 py-2 text-right font-bold text-green-600">
                                            R$ \${fairDetails.total_value.toFixed(2).replace('.', ',')}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        \${fairDetails.observations ? \`
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-700 mb-2">Observações</h4>
                            <p class="text-gray-700">\${fairDetails.observations}</p>
                        </div>
                        \` : ''}
                    </div>
                \`;
                
                document.getElementById('viewContent').innerHTML = viewContent;
                document.getElementById('viewModal').classList.add('active');
            });
        }

        function closeViewModal() {
            document.getElementById('viewModal').classList.remove('active');
        }

        // Editar feira
        function editFair(id) {
            fetch(\`/api/fairs/\${id}\`, {
                headers: { 'Authorization': \`Bearer \${token}\` }
            })
            .then(r => r.json())
            .then(fair => {
                document.getElementById('modalTitle').textContent = 'Editar Feira';
                document.getElementById('fairId').value = fair.id;
                document.getElementById('fairDate').value = fair.date;
                document.getElementById('location').value = fair.location;
                document.getElementById('observations').value = fair.observations || '';
                
                // Limpar e recriar itens
                document.getElementById('fairItemsContainer').innerHTML = '';
                fairItemCounter = 0;
                
                fair.items.forEach(item => {
                    addFairItem();
                    const lastItem = document.querySelector('.fair-item:last-child');
                    lastItem.querySelector('.item-quantity').value = item.quantity;
                    lastItem.querySelector('.item-category').value = item.category;
                    lastItem.querySelector('.item-unit-value').value = item.unit_value;
                });
                
                calculateTotal();
                document.getElementById('fairModal').classList.remove('hidden');
            });
        }

        // Deletar feira
        async function deleteFair(id) {
            if (!confirm('Tem certeza que deseja deletar esta feira?')) return;
            
            try {
                const response = await fetch(\`/api/fairs/\${id}\`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    showToast('Feira deletada com sucesso!', 'success');
                    loadFairs();
                } else {
                    showToast('Erro ao deletar feira', 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao deletar feira', 'error');
            }
        }

        // Finalizar feira
        window.finalizeFair = async function(id) {
            try {
                // Buscar detalhes da feira
                const response = await fetch(\`/api/fairs/\${id}\`, {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                
                if (!response.ok) {
                    showToast('Erro ao carregar feira', 'error');
                    return;
                }
                
                const fair = await response.json();
                
                // Preencher modal de finalização
                document.getElementById('finalizeFairId').value = id;
                
                const container = document.getElementById('finalizeItemsContainer');
                container.innerHTML = fair.items.map((item, index) => \`
                    <tr data-item-id="\${item.id}" data-index="\${index}">
                        <td class="px-3 py-3 text-sm text-gray-900">\${item.category}</td>
                        <td class="px-3 py-3 text-center text-sm font-medium">\${item.quantity}</td>
                        <td class="px-3 py-3 text-center text-sm">R$ \${item.unit_value.toFixed(2).replace('.', ',')}</td>
                        <td class="px-3 py-3">
                            <input type="number" 
                                   class="quantity-returned w-20 px-2 py-1 border border-gray-300 rounded text-center" 
                                   min="0" 
                                   max="\${item.quantity}" 
                                   value="0"
                                   data-index="\${index}"
                                   onchange="calculateFinalizeRow(\${index})">
                        </td>
                        <td class="px-3 py-3 text-center text-sm font-semibold quantity-sold-\${index}">-</td>
                        <td class="px-3 py-3">
                            <input type="number" 
                                   step="0.01" 
                                   class="unit-cost w-24 px-2 py-1 border border-gray-300 rounded text-center" 
                                   min="0" 
                                   value="0"
                                   data-index="\${index}"
                                   onchange="calculateFinalizeRow(\${index})">
                        </td>
                        <td class="px-3 py-3 text-right text-sm font-semibold text-blue-600 item-revenue-\${index}">-</td>
                        <td class="px-3 py-3 text-right text-sm font-semibold text-orange-600 item-cost-\${index}">-</td>
                        <td class="px-3 py-3 text-right text-sm font-semibold text-green-600 item-profit-\${index}">-</td>
                    </tr>
                \`).join('');
                
                // Abrir modal
                document.getElementById('finalizeModal').classList.remove('hidden');
                
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao abrir modal de finalização', 'error');
            }
        }

        // Calcular valores de uma linha
        window.calculateFinalizeRow = function(index) {
            const row = document.querySelector(\`[data-index="\${index}"]\`).closest('tr');
            const quantityTaken = parseInt(row.cells[1].textContent);
            const salePrice = parseFloat(row.cells[2].textContent.replace('R$ ', '').replace(',', '.'));
            
            const quantityReturned = parseInt(row.querySelector('.quantity-returned').value) || 0;
            const unitCost = parseFloat(row.querySelector('.unit-cost').value) || 0;
            
            // Validar quantidade retornada
            if (quantityReturned > quantityTaken) {
                row.querySelector('.quantity-returned').value = quantityTaken;
                return calculateFinalizeRow(index);
            }
            
            const quantitySold = quantityTaken - quantityReturned;
            const revenue = quantitySold * salePrice;
            const cost = quantitySold * unitCost;
            const profit = revenue - cost;
            
            // Atualizar valores na linha
            document.querySelector(\`.quantity-sold-\${index}\`).textContent = quantitySold;
            document.querySelector(\`.item-revenue-\${index}\`).textContent = \`R$ \${revenue.toFixed(2).replace('.', ',')}\`;
            document.querySelector(\`.item-cost-\${index}\`).textContent = \`R$ \${cost.toFixed(2).replace('.', ',')}\`;
            
            const profitClass = profit >= 0 ? 'text-green-600' : 'text-red-600';
            const profitElement = document.querySelector(\`.item-profit-\${index}\`);
            profitElement.textContent = \`R$ \${profit.toFixed(2).replace('.', ',')}\`;
            profitElement.className = \`px-3 py-3 text-right text-sm font-semibold \${profitClass}\`;
            
            // Recalcular totais
            calculateFinalizeTotals();
        }

        // Calcular totais da finalização
        window.calculateFinalizeTotals = function() {
            let totalRevenue = 0;
            let totalCost = 0;
            let totalProfit = 0;
            
            document.querySelectorAll('#finalizeItemsContainer tr').forEach((row, index) => {
                const quantityTaken = parseInt(row.cells[1].textContent);
                const salePrice = parseFloat(row.cells[2].textContent.replace('R$ ', '').replace(',', '.'));
                const quantityReturned = parseInt(row.querySelector('.quantity-returned').value) || 0;
                const unitCost = parseFloat(row.querySelector('.unit-cost').value) || 0;
                
                const quantitySold = quantityTaken - quantityReturned;
                const revenue = quantitySold * salePrice;
                const cost = quantitySold * unitCost;
                const profit = revenue - cost;
                
                totalRevenue += revenue;
                totalCost += cost;
                totalProfit += profit;
            });
            
            document.getElementById('totalRevenue').textContent = \`R$ \${totalRevenue.toFixed(2).replace('.', ',')}\`;
            document.getElementById('totalCost').textContent = \`R$ \${totalCost.toFixed(2).replace('.', ',')}\`;
            
            const profitElement = document.getElementById('totalProfit');
            profitElement.textContent = \`R$ \${totalProfit.toFixed(2).replace('.', ',')}\`;
            profitElement.className = totalProfit >= 0 
                ? 'text-2xl font-bold text-green-600' 
                : 'text-2xl font-bold text-red-600';
        }

        // Fechar modal de finalização
        window.closeFinalizeModal = function() {
            document.getElementById('finalizeModal').classList.add('hidden');
            document.getElementById('finalizeForm').reset();
        }

        // Submeter finalização
        document.getElementById('finalizeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fairId = document.getElementById('finalizeFairId').value;
            
            // Coletar dados dos itens
            const items = [];
            document.querySelectorAll('#finalizeItemsContainer tr').forEach(row => {
                const itemId = row.dataset.itemId;
                const quantityReturned = parseInt(row.querySelector('.quantity-returned').value) || 0;
                const unitCost = parseFloat(row.querySelector('.unit-cost').value) || 0;
                
                items.push({
                    item_id: itemId,
                    quantity_returned: quantityReturned,
                    unit_cost: unitCost
                });
            });
            
            try {
                const response = await fetch(\`/api/fairs/\${fairId}/finalize\`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${token}\`
                    },
                    body: JSON.stringify({ items })
                });
                
                if (response.ok) {
                    showToast('Feira finalizada com sucesso!', 'success');
                    closeFinalizeModal();
                    loadFairs();
                } else {
                    const data = await response.json();
                    showToast(data.error || 'Erro ao finalizar feira', 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao finalizar feira', 'error');
            }
        });

        // Submeter formulário
        document.getElementById('fairForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fairId = document.getElementById('fairId').value;
            const date = document.getElementById('fairDate').value;
            const location = document.getElementById('location').value;
            const observations = document.getElementById('observations').value;
            
            // Coletar itens
            const items = [];
            document.querySelectorAll('.fair-item').forEach(item => {
                items.push({
                    quantity: parseInt(item.querySelector('.item-quantity').value),
                    category: item.querySelector('.item-category').value,
                    unit_value: parseFloat(item.querySelector('.item-unit-value').value)
                });
            });
            
            if (items.length === 0) {
                showToast('Adicione pelo menos um item à feira', 'warning');
                return;
            }
            
            const data = { date, location, observations, items };
            
            try {
                const url = fairId ? \`/api/fairs/\${fairId}\` : '/api/fairs';
                const method = fairId ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${token}\`
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showToast(fairId ? 'Feira atualizada com sucesso!' : 'Feira criada com sucesso!', 'success');
                    closeModal();
                    loadFairs();
                } else {
                    const error = await response.json();
                    showToast(\`Erro: \${error.error}\`, 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                showToast('Erro ao salvar feira', 'error');
            }
        });

        // Toggle sidebar mobile
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        // Inicializar
        initializeYearFilter();
        loadFairs();
