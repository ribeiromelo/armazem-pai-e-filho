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

        let fairs = [];
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

        // Carregar feiras
        async function loadSheets() {
            try {
                const supplierId = document.getElementById('supplierFilter').value;
                const month = document.getElementById('monthFilter').value;
                
                let url = '/api/fairs?';
                if (supplierId) url += \`supplier_id=\${supplierId}&\`;
                if (month) url += \`month=\${month}&\`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    fairs = await response.json();
                    renderSheets();
                    loadStats();
                }
            } catch (error) {
                console.error('Erro ao carregar feiras:', error);
            }
        }

        // Carregar estatísticas
        async function loadStats() {
            try {
                const supplierId = document.getElementById('supplierFilter').value;
                const month = document.getElementById('monthFilter').value;
                
                let url = '/api/fairs/stats/summary?';
                if (supplierId) url += \`supplier_id=\${supplierId}&\`;
                if (month) url += \`month=\${month}&\`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    const stats = await response.json();
                    
                    document.getElementById('totalSheets').textContent = stats.total_fairs;
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
            
            const filtered = fairs.filter(s => {
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
            
            document.getElementById('fairsTable').innerHTML = html || \`
                <tr>
                    <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                        Nenhuma feira encontrada
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
            document.getElementById('modalTitle').textContent = 'Nova Feira';
            document.getElementById('sheetForm').reset();
            document.getElementById('sheetId').value = '';
            document.getElementById('stockItemsContainer').innerHTML = '';
            stockItemCounter = 0;
            addStockItem(); // Adicionar um item inicial
            updatePreview();
            document.getElementById('sheetModal').classList.remove('hidden');
        }

        function viewSheet(id) {
            const sheet = fairs.find(s => s.id === id);
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
                                    <h3 class="text-xl font-bold text-blue-800">Feira #\${sheet.id}</h3>
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
                    '<head><title>Imprimir Feira</title></head>' +
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
            const sheet = fairs.find(s => s.id === id);
            if (sheet) {
                document.getElementById('modalTitle').textContent = 'Editar Feira';
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
                const response = await fetch(id ? \`/api/fairs/\${id}\` : '/api/fairs', {
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
                    alert(error.error || 'Erro ao salvar feira');
                }
            } catch (error) {
                alert('Erro ao salvar feira');
            }
        });

        async function deleteSheet(id) {
            if (!confirm('Tem certeza que deseja excluir esta feira?')) return;
            
            try {
                const response = await fetch(\`/api/fairs/\${id}\`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': \`Bearer \${token}\`
                    }
                });
                
                if (response.ok) {
                    loadSheets();
                }
            } catch (error) {
                alert('Erro ao excluir feira');
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
