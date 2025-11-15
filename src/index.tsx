import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';

// Importar rotas
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import suppliersRoutes from './routes/suppliers';
import sheetsRoutes from './routes/sheets';
import fairsRoutes from './routes/fairs';
import receiptsRoutes from './routes/receipts';
import { dashboardPage } from './pages/dashboard-page';
import { fornecedoresPage } from './pages/fornecedores-page';
import { fichasPage } from './pages/fichas-page';
import { feirasPage } from './pages/feiras-page';
import { recibosPage } from './pages/recibos-page';

const app = new Hono<{ Bindings: Bindings }>();

// Configurar CORS
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

// Rotas da API
app.route('/api/auth', authRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/suppliers', suppliersRoutes);
app.route('/api/sheets', sheetsRoutes);
app.route('/api/fairs', fairsRoutes);
app.route('/api/receipts', receiptsRoutes);

// Rota raiz - servir página de login diretamente
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Armazém Pai e Filho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-blue-50 to-white min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md px-6">
        <!-- Logo/Título -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-800">Armazém Pai e Filho</h1>
            <p class="text-gray-600 mt-2">Sistema de Gestão</p>
        </div>

        <!-- Card de Login -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">Entrar no Sistema</h2>
            
            <form id="loginForm">
                <!-- Campo Usuário -->
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                        Usuário
                    </label>
                    <input 
                        type="text" 
                        id="username"
                        name="username"
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Digite seu usuário"
                    >
                </div>

                <!-- Campo Senha -->
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Senha
                    </label>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Digite sua senha"
                    >
                </div>

                <!-- Mensagem de Erro -->
                <div id="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg hidden">
                    <p id="errorText"></p>
                </div>

                <!-- Botão de Login -->
                <button 
                    type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                    Entrar
                </button>
            </form>
            
            <!-- Botão Setup Admin (temporário) -->
            <div class="mt-4 text-center">
                <button onclick="setupAdmin()" class="text-sm text-blue-600 hover:text-blue-700">
                    Criar Admin Inicial (primeira vez)
                </button>
            </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-gray-500 text-sm mt-6">
            © 2024 Armazém Pai e Filho. Todos os direitos reservados.
        </p>
    </div>

    <script>
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Limpar mensagem de erro
            errorMessage.classList.add('hidden');
            
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    // Salvar token no localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Redirecionar para o dashboard
                    window.location.href = '/dashboard';
                } else {
                    // Mostrar erro
                    errorText.textContent = data.error || 'Erro ao fazer login';
                    errorMessage.classList.remove('hidden');
                }
            } catch (error) {
                errorText.textContent = 'Erro de conexão. Tente novamente.';
                errorMessage.classList.remove('hidden');
            }
        });
        
        async function setupAdmin() {
            try {
                const response = await fetch('/api/auth/setup-admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    alert('Admin criado com sucesso!\\nUsuário: ' + data.credentials.username + '\\nSenha: ' + data.credentials.password);
                } else {
                    alert(data.error || 'Erro ao criar admin');
                }
            } catch (error) {
                alert('Erro ao criar admin');
            }
        }
    </script>
</body>
</html>`);
});

// Inicializar banco de dados na primeira requisição
app.use('*', async (c, next) => {
  try {
    // Criar tabelas se não existirem
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        permission TEXT NOT NULL CHECK(permission IN ('view', 'edit', 'admin')),
        is_admin BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        product_type TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('active', 'settled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS weekly_sheets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supplier_id INTEGER NOT NULL,
        date DATE NOT NULL,
        double_checked BOOLEAN DEFAULT FALSE,
        stock_merchandise TEXT,
        credit_text TEXT,
        credit_total DECIMAL(10,2) DEFAULT 0,
        envelope_money DECIMAL(10,2) DEFAULT 0,
        folder_total DECIMAL(10,2) DEFAULT 0,
        observations TEXT,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `).run();

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS fairs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        location TEXT NOT NULL,
        total_value DECIMAL(10,2) DEFAULT 0,
        observations TEXT,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `).run();

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS fair_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fair_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        category TEXT NOT NULL,
        unit_value DECIMAL(10,2) NOT NULL,
        total_value DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fair_id) REFERENCES fairs(id) ON DELETE CASCADE
      )
    `).run();

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS receipts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        buyer_name TEXT NOT NULL,
        date DATE NOT NULL,
        total_value DECIMAL(10,2) NOT NULL,
        signature TEXT,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `).run();

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS receipt_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        receipt_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_value DECIMAL(10,2) NOT NULL,
        total_value DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
      )
    `).run();
    
  } catch (error) {
    console.log('Tabelas já existem ou erro ao criar:', error);
  }
  
  await next();
});

// Healthcheck
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota do Dashboard
app.get('/dashboard', (c) => {
  return c.html(dashboardPage);
});

// Rota de Fornecedores
app.get('/fornecedores', (c) => {
  return c.html(fornecedoresPage);
});

// Rota de Fichas Semanais
app.get('/fichas', (c) => {
  return c.html(fichasPage);
});

// Rota de Feiras
app.get('/feiras', (c) => {
  return c.html(feirasPage);
});

// Rota de Recibos
app.get('/recibos', (c) => {
  return c.html(recibosPage);
});

export default app;