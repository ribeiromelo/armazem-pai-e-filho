export const feirasPage = \`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feiras - Armazém Pai e Filho</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside id="sidebar" class="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex-shrink-0">
            <div class="p-6">
                <h1 class="text-2xl font-bold">Armazém P&F</h1>
                <p class="text-sm text-blue-200">Sistema de Gestão</p>
            </div>
            <nav class="mt-6">
                <a href="/dashboard" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-home mr-3"></i>Dashboard</a>
                <a href="/fornecedores" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-users mr-3"></i>Fornecedores</a>
                <a href="/fichas" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-file-alt mr-3"></i>Fichas Semanais</a>
                <a href="/feiras" class="flex items-center px-6 py-3 bg-blue-700"><i class="fas fa-store mr-3"></i>Feiras</a>
                <a href="/recebidos" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-shopping-cart mr-3"></i>Recebidos</a>
                <a href="/financeiro" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-dollar-sign mr-3"></i>Financeiro</a>
                <a href="#" onclick="logout()" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700"><i class="fas fa-sign-out-alt mr-3"></i>Sair</a>
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-white shadow-sm z-10">
                <div class="flex items-center justify-between px-6 py-4">
                    <h2 class="text-2xl font-semibold text-gray-800">Feiras</h2>
                    <div class="flex items-center space-x-4">
                        <span id="userName" class="text-gray-600"></span>
                        <button onclick="logout()" class="text-gray-600 hover:text-gray-800"><i class="fas fa-sign-out-alt"></i></button>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                <div id="loading" class="text-center py-8">
                    <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                    <p class="mt-4 text-gray-600">Carregando...</p>
                </div>
                <div id="content" style="display:none;"></div>
            </main>
        </div>
    </div>
    
    <!-- JavaScript Externo -->
    <script src="/static/feiras-complete.js"></script>
</body>
</html>
\`;
